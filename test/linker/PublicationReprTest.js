'use strict';
var should = require('should');
var linker = require('../../src/linker.js');
var _ = require('lodash');

describe('Publication Representation test', function() {
	var jsonRepresentations = [{
		id:1,
		title:'A publication',
		type:'Journal',
		numberOfPages:23,
		year:2015,
		url:'www.publication.org',
		abstract:'a possibly long text',
		uploader:1,
		authors:[{id:1},{id:2}]

	},
	{
		title:'A publication',
		type:'Proceeding',
		authors:[]
	}];

	var dbRepresentations = [{
		id:1,
		title:'A publication',
		publication_type:'Journal',
		nr_of_pages:23,
		published_in_year:2015,
		url:'www.publication.org',
		summary_text:'a possibly long text',
		uploader:1,
		authors:[1,2]
	},
	{
		title:'A publication',
		publication_type:'Proceeding',
		authors:[]
	}];
	var dbReprWithRelations = [{
		id:1,
		title:'A publication',
		publication_type:'Journal',
		nr_of_pages:23,
		published_in_year:2015,
		url:'www.publication.org',
		summary_text:'a possibly long text',
		uploader:{id:1},
		authors:[{id:1},{id:2}]
	},
	{
		title:'A publication',
		publication_type:'Proceeding',
		authors:[]
	}];
	var search= {};
	search[linker.searchKey] = 'Convert Word';
	var expected = [{
		key:'title',
		value:'%Convert%'
	},
	{
		key:'title',
		value:'%Word%'
	}];

	it('should convert the JSON representation', function() {
		for(var repr in jsonRepresentations) {
			var converted = linker.publicationRepr.format(jsonRepresentations[repr]);
			var relations = linker.publicationRepr.formatRelations(jsonRepresentations[repr]);
			for(var rel in relations) {
				converted[rel] = relations[rel];
			}
			_.isEqual(converted, dbRepresentations[repr]).should.be.true;
		}
	});
	it('should convert the DB representation', function() {
		for(var repr in dbReprWithRelations) {
			var converted = linker.publicationRepr.parse(dbReprWithRelations[repr]);
			_.isEqual(converted, jsonRepresentations[repr]).should.be.true;
		}
	});
	it('should convert search-string', function() {
		var converted = linker.publicationRepr.formatSearch(search);
		_.isEqual(expected, converted).should.be.true;
	});
});