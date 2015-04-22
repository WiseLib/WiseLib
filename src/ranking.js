'use strict';
var DBManager = require('./dbmanager.js');
var linker = require('./linker.js');
var Promise = require('bluebird');

function calculateRank(jsonObj, type, callback) { //type = linker representation

	/*
		Journal/Conference = ligt vast (in database)
		Persoon = combinatie van aantal gepubliceerde publicaties en publicaties per jaar
		Publicatie = combinatie van rank van auteurs, aantal citaties en rank van Journal/Conference
	 */

	var PublicationRank = function(subRank) {

		var numberOfCitations = jsonObj.referencedPublications.length;

		var authorRanks = [];

		var counter=0;
		jsonObj.authors.forEach(function(author) {
				DBManager.get({id: author.id}, linker.personRepr,
					function(result) {
						calculateRank(result[0], linker.personRepr, function(rank) {
								authorRanks.push(rank);
								++counter;
								if (counter === jsonObj.authors.length) {
									var averageAuthorRank = 0;
									authorRanks.forEach(function(authorRank) {
										averageAuthorRank += authorRank;
									});
									averageAuthorRank = averageAuthorRank / authorRanks.length;
									callback(numberOfCitations * subRank * averageAuthorRank); //no citations : very bad --> rank = 0
								}

							});
					});
			});
	};

	if (type === linker.proceedingPublicationRepr) {
		var rank;
		var proceedingId = jsonObj.proceeding;
		if (proceedingId === undefined) callback(undefined);
		DBManager.get({id: proceedingId
		}, linker.proceedingRepr, function(result) {

			rank = result[0].rank;
			PublicationRank(rank);
		});
	} else if (type === linker.journalPublicationRepr) {
		var rank;
		var journalId = jsonObj.journal;
		if (journalId === undefined) callback(undefined);
		DBManager.get({id: journalId
		}, linker.journalRepr, function(result) {
			rank = result[0].rank;
			PublicationRank(rank);
		});

	} else if (type === linker.personRepr) { //gemiddelde aantal publicaties (per jaar) * (1 + publicaties dit jaar)
		var publications = jsonObj.publications;

		var numberOfPublications = publications.length;
		if(numberOfPublications === 0) callback(0);

		var years = [];

		var counter = 0;
		publications.map(function(publication) {
			DBManager.get({id: publication.id
			}, linker.publicationRepr, function(result) {
				counter++;
				years.push(result[0].year);

				if (counter === numberOfPublications) {
					years.sort();

					var yearsOfWriting = years[years.length - 1] - years[0];
					var date = new Date();
					var thisYearIndex = years.indexOf(date.getFullYear());
					var publicationsThisYear = years.length - thisYearIndex;
					var rank = (numberOfPublications / (yearsOfWriting + 1)) * (1 + publicationsThisYear); // years + 1 because of terrible test data --> /0 errors

					callback(rank);
				}
			});
		});



	} else throw new Error('Wrong type for ranking:' + type);
}

module.exports = {
	calculateRank: calculateRank
};