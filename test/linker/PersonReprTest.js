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

	it('should convert the JSON representation', function() {
		for(var repr in jsonRepresentations) {
			var converted = linker.personRepr.format(jsonRepresentations[repr]);
			var relations = linker.personRepr.formatRelations(jsonRepresentations[repr]);
			for(var rel in relations) {
				converted[rel] = relations[rel];
			}
			compare(converted, dbRepresentations[repr]).should.be.true;
		}
	});
	it('should convert the DB representation', function() {
		for(var repr in dbRepresentations) {
			var converted = linker.personRepr.parse(jsonRepresentations[repr]);
			compare(converted, dbRepresentations[repr]).should.be.true;
		}
	});
});