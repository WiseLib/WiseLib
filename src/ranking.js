'use strict';
var DBManager = require('./dbmanager.js');
var linker = require('./linker.js');

function calculateRank(jsonObj, type, callback) { //type = linker representation

	if (type === linker.proceedingPublicationRepr) {
		var rank;
		var proceedingId = jsonObj.proceeding;
		if (proceedingId === undefined) callback(undefined);
		DBManager.get({
			id: proceedingId
		}, linker.proceedingRepr, function(result) {
			rank = result[0].rank;
			callback(rank);
		})
	} else if (type === linker.journalPublicationRepr) {
		var rank;
		var journalId = jsonObj.journal;
		if (journalId === undefined) callback(undefined);
		DBManager.get({
			id: journalId
		}, linker.journalRepr, function(result) {
			rank = result[0].rank;
			callback(rank);
		})

	} else if (type === linker.personRepr) {
		var publications = jsonObj.publications;
		var ranks = new Array(jsonObj.length);

		var compoundRank = function() {
			var rank = 0;
			ranks.forEach(function(pubRank) {
				rank += pubRank;
			})

			rank /= ranks.length;
			callback(rank);
		}

		var length = publications.length
		for (var i = 0; i < publications.length; i++) {
			(function(i) {
				var publicationid = publications[i].id;
				var pubresult;
				var type;
				DBManager.get({id: publicationid}, linker.journalPublicationRepr, function(result) {
					if (result.length == 0) { //not a journal publication
						DBManager.get({id: publicationid}, linker.proceedingPublicationRepr, function(result) {
							if (result.length == 0) { //not a proceeding publication --> error: rank = 0
								ranks[i] = 0;
								--length;
								if (length == 0) compoundRank();
							}
							else {
								pubresult = result[0]; //publication is proceeding publication
								type = linker.proceedingPublicationRepr;
								calculateRank(pubresult, type, function(rank) { //calculate its rank
									ranks[i] = rank;
									--length;
									if (length == 0) compoundRank();
								})
							}
						})
					} else { //publication is journal publication
						pubresult = result[0];
						type = linker.journalPublicationRepr;
						calculateRank(pubresult, type, function(rank) {
							ranks[i] = rank;
							--length;
							if (length == 0) compoundRank();
						})
					}
				})
			}(i));
		};
	} else throw new Error('Wrong type for ranking:' + type)
}

module.exports = {
	calculateRank: calculateRank
}