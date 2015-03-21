'use strict';
var should = require('should');
var linker = require('../../src/linker.js');
var _ = require('lodash');

describe('Discipline Representation test', function() {
	var jsonRepresentations = [{
		id:1,
		name:'Computer Science'
	},
	{
		id:2,
		name:'Operating systems',
		parent: 1
	}];

	var dbRepresentations = [{
		id: 1,
		name:'Computer Science'
	},
	{
		id: 2,
		name:'Operating systems',
		parent:1
	}];
	var dbReprWithRelations = [{
		id: 1,
		name:'Computer Science'
	},
	{
		id: 2,
		name:'Operating systems',
		parent:{id:1}
	}];

	it('should convert the JSON representation', function() {
		for(var repr in jsonRepresentations) {
			var converted = linker.disciplineRepr.format(jsonRepresentations[repr]);
			var relations = linker.disciplineRepr.formatRelations(jsonRepresentations[repr]);
			for(var rel in relations) {
				converted[rel] = relations[rel];
			}
			_.isEqual(converted, dbRepresentations[repr]).should.be.true;
		}
	});
	it('should convert the DB representation', function() {
		for(var repr in dbReprWithRelations) {
			var converted = linker.disciplineRepr.parse(dbReprWithRelations[repr]);
			_.isEqual(converted, jsonRepresentations[repr]).should.be.true;
		}
	});
});