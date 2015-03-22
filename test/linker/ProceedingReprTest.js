'use strict';
var should = require('should');
var linker = require('../../src/linker.js');
var _ = require('lodash');

describe('Proceeding Representation test', function() {
	var jsonRepresentations = [{
		id:1,
		name:'Proceedings of the IEEE Computer Society Conference on Computer Vision and Pattern Recognition',
		rank:2.954,
		disciplines:[{id:11},{id:65}]

	},
	{
		name:'Non-existing Proceeding',
		disciplines:[]
	}];

	var dbRepresentations = [{
		id:1,
		name:'Proceedings of the IEEE Computer Society Conference on Computer Vision and Pattern Recognition',
		rank:2.954,
		disciplines:[11,65]
	},
	{
		name:'Non-existing Proceeding',
		disciplines:[]
	}];
	var dbReprWithRelations = [{
		id:1,
		name:'Proceedings of the IEEE Computer Society Conference on Computer Vision and Pattern Recognition',
		rank:2.954,
		disciplines:[{id:11},{id:65}]
	},
	{
		name:'Non-existing Proceeding',
		disciplines:[]
	}];
	var search= {};
	search[linker.searchKey] = 'Convert Word';
	var expected = [{
		key:'name',
		value:'%Convert%'
	},
	{
		key:'name',
		value:'%Word%'
	}];

	it('should convert the JSON representation', function() {
		for(var repr in jsonRepresentations) {
			var converted = linker.proceedingRepr.format(jsonRepresentations[repr]);
			var relations = linker.proceedingRepr.formatRelations(jsonRepresentations[repr]);
			for(var rel in relations) {
				converted[rel] = relations[rel];
			}
			_.isEqual(converted, dbRepresentations[repr]).should.be.true;
		}
	});
	it('should convert the DB representation', function() {
		for(var repr in dbReprWithRelations) {
			var converted = linker.proceedingRepr.parse(dbReprWithRelations[repr]);
			_.isEqual(converted, jsonRepresentations[repr]).should.be.true;
		}
	});
	it('should convert search-string', function() {
		var converted = linker.proceedingRepr.formatSearch(search);
		_.isEqual(expected, converted).should.be.true;
	});
});