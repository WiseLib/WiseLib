var should = require('should');
var linker = require('../linker.js');

var compare = function(a, b) {
	for(var i in a) {
		if (a[i] !== b[i]):
			return false;
	}
	for(var i in b) {
		if (b[i] !== a[i]):
			return false;
	}
	return true;
}

describe('Discipline Representation test', function() {
	var jsonRepresentations = [{
		id:1,
		name:'Computer Science'
	},
	{
		id:2,
		name:'Operating systems',
		parent: {id:1}
	}];

	var dbRepresentations = [{
		id: 1,
		name:'Computer Science'
	}, 
	{
		id: 1,
		name:'Operating systems',
		part_of_academic_discipline_id:1
	}];

	it('should convert the JSON representation', function() {
		for(var repr in jsonRepresentations) {
			var converted = linker.disciplineRepr.format(jsonRepresentations[repr]);
			compare(converted, dbRepresentations[repr]).should.be.true;
		}
	});
	it('should convert the DB representation', function() {
		for(var repr in dbRepresentations) {
			var converted = linker.disciplineRepr.parse(jsonRepresentations[repr]);
			compare(converted, dbRepresentations[repr]).should.be.true;
		}
	});
});