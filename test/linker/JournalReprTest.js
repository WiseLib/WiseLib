var should = require('should');
var linker = require('../../lib/linker.js');

var compare = function(a, b) {
	for(var i in a) {
		if (a[i] !== b[i])
			return false;
	}
	for(var i in b) {
		if (b[i] !== a[i])
			return false;
	}
	return true;
}

describe('Journal Representation test', function() {
	var jsonRepresentations = [{
		id:7,
		name:'Foundations and Trends in Machine Learning',
		rank:12.076,
		disciplines:[{id:11},{id:13},{id:50}]

	},
	{
		name:'Non-existing Journal',
		disciplines:[]
	}];

	var dbRepresentations = [{
		id:7,
		name:'Foundations and Trends in Machine Learning',
		rank:12.076,
		disciplines:[11,13,50]
	},
	{
		name:'Non-existing Journal',
		disciplines:[]
	}];

	it('should convert the JSON representation', function() {
		for(var repr in jsonRepresentations) {
			var converted = linker.journalRepr.format(jsonRepresentations[repr]);
			var relations = linker.journalRepr.formatRelations(jsonRepresentations[repr]);
			for(var rel in relations) {
				converted[rel] = relations[rel];
			}
			compare(converted, dbRepresentations[repr]).should.be.true;
		}
	});
	it('should convert the DB representation', function() {
		for(var repr in dbRepresentations) {
			var converted = linker.journalRepr.parse(jsonRepresentations[repr]);
			compare(converted, dbRepresentations[repr]).should.be.true;
		}
	});
});