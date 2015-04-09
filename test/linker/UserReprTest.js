'use strict';
var should = require('should');
var linker = require('../../src/linker.js');
var _ = require('lodash');

describe('User Representation test', function() {
	var jsonRepresentations = [{
		id:1,
		email:'mreymond@vub.ac.be',
		password:'password',
		person:1

	}];

	var dbRepresentations = [{
		id:1,
		email_address:'mreymond@vub.ac.be',
		password:'password',
		person:1
	}];
	var dbReprWithRelations = [{
		id:1,
		email_address:'mreymond@vub.ac.be',
		password:'password',
		person:{id:1}
	}];
	var search= {};
	search[linker.searchKey] = 'Convert Word';
	var expected = [{
		key:'email_address',
		value:'%Convert%'
	},
	{
		key:'email_address',
		value:'%Word%'
	}];

	it('should convert the JSON representation', function() {
		for(var repr in jsonRepresentations) {
			var converted = linker.userRepr.format(jsonRepresentations[repr]);
			var relations = linker.userRepr.formatRelations(jsonRepresentations[repr]);
			for(var rel in relations) {
				converted[rel] = relations[rel];
			}
			_.isEqual(converted, dbRepresentations[repr]).should.be.true;
		}
	});
	it('should convert the DB representation', function() {
		for(var repr in dbReprWithRelations) {
			var converted = linker.userRepr.parse(dbReprWithRelations[repr]);
			_.isEqual(converted, jsonRepresentations[repr]).should.be.true;
		}
	});
	it('should convert search-string', function() {
		var converted = linker.userRepr.formatSearch(search);
		_.isEqual(expected, converted).should.be.true;
	});
});