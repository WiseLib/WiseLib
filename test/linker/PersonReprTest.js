'use strict';
var should = require('should');
var linker = require('../../src/linker.js');
var _ = require('lodash');

describe('Person Representation test', function() {
	var jsonRepresentations = [{
		id:1,
		firstName:'Mathieu',
		lastName:'Reymond',
		picture:'path/to/picture',
		publications:[{id:2},{id:3}]

	},
	{
		firstName:'Wout',
		publications:[]
	}];

	var dbRepresentations = [{
		id:1,
		first_name:'Mathieu',
		last_name:'Reymond',
		picture:'path/to/picture',
		publications:[2,3]
	},
	{
		first_name:'Wout',
		publications:[]
	}];
	var dbReprWithRelations = [{
		id:1,
		first_name:'Mathieu',
		last_name:'Reymond',
		picture:'path/to/picture',
		publications:[{id:2},{id:3}]
	},
	{
		first_name:'Wout',
		publications:[]
	}];
	var search= {};
	search[linker.searchKey] = 'Convert Word';
	var expected = [{
		key:'first_name',
		value:'%Convert%'
	},
	{
		key:'first_name',
		value:'%Word%'
	},
	{
		key:'last_name',
		value:'%Convert%'
	},
	{
		key:'last_name',
		value:'%Word%'
	}];

	it('should convert the JSON representation', function() {
		for(var repr in jsonRepresentations) {
			var converted = linker.personRepr.format(jsonRepresentations[repr]);
			var relations = linker.personRepr.formatRelations(jsonRepresentations[repr]);
			for(var rel in relations) {
				converted[rel] = relations[rel];
			}
			_.isEqual(converted, dbRepresentations[repr]).should.be.true;
		}
	});
	it('should convert the DB representation', function() {
		for(var repr in dbReprWithRelations) {
			var converted = linker.personRepr.parse(dbReprWithRelations[repr]);
			_.isEqual(converted, jsonRepresentations[repr]).should.be.true;
		}
	});
	it('should convert search-string', function() {
		var converted = linker.personRepr.formatSearch(search);
		_.isEqual(expected, converted).should.be.true;
	});
});