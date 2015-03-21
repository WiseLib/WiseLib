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

describe('User Representation test', function() {
	var jsonRepresentations = [{
		id:1,
		email:'mreymond@vub.ac.be',
		password:'password',
		person:{id:1}

	}];

	var dbRepresentations = [{
		id:1,
		email_address:'mreymond@vub.ac.be',
		password:'password',
		person_id:1
	}];

	it('should convert the JSON representation', function() {
		for(var repr in jsonRepresentations) {
			var converted = linker.userRepr.format(jsonRepresentations[repr]);
			var relations = linker.userRepr.formatRelations(jsonRepresentations[repr]);
			for(var rel in relations) {
				converted[rel] = relations[rel];
			}
			compare(converted, dbRepresentations[repr]).should.be.true;
		}
	});
	it('should convert the DB representation', function() {
		for(var repr in dbRepresentations) {
			var converted = linker.userRepr.parse(jsonRepresentations[repr]);
			compare(converted, dbRepresentations[repr]).should.be.true;
		}
	});
});