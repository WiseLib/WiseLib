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
		published_by_user_id:1,
		authors:[{id:1},{id:2}]
	},
	{
		title:'A publication',
		publication_type:'Proceeding',
		authors:[]
	}];

	it('should convert the JSON representation', function() {
		for(var repr in jsonRepresentations) {
			var converted = linker.publicationRepr.format(jsonRepresentations[repr]);
			var relations = linker.publicationRepr.formatRelations(jsonRepresentations[repr]);
			for(var rel in relations) {
				converted[rel] = relations[rel];
			}
			compare(converted, dbRepresentations[repr]).should.be.true;
		}
	});
	it('should convert the DB representation', function() {
		for(var repr in dbRepresentations) {
			var converted = linker.publicationRepr.parse(jsonRepresentations[repr]);
			compare(converted, dbRepresentations[repr]).should.be.true;
		}
	});
});