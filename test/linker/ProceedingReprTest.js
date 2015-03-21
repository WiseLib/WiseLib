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

	it('should convert the JSON representation', function() {
		for(var repr in jsonRepresentations) {
			var converted = linker.proceedingRepr.format(jsonRepresentations[repr]);
			var relations = linker.proceedingRepr.formatRelations(jsonRepresentations[repr]);
			for(var rel in relations) {
				converted[rel] = relations[rel];
			}
			compare(converted, dbRepresentations[repr]).should.be.true;
		}
	});
	it('should convert the DB representation', function() {
		for(var repr in dbRepresentations) {
			var converted = linker.proceedingRepr.parse(jsonRepresentations[repr]);
			compare(converted, dbRepresentations[repr]).should.be.true;
		}
	});
});