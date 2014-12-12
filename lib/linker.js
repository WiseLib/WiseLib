'use strict';
//person
var personRepr = {
	id: 'person.id',
	firstName: 'person.first_name',
	lastName: 'person.last_name'
};

//discipline
var disciplineRepr = {
	id: 'academic_discipline.id',
	name: 'academic_discipline.name',
	parentId: 'academic_discipline.part_of_academic_discipline_id'
};

//journal
var journalRepr = {
	id: 'journal.id',
	name: 'journal.name',
	rank: 'journal.rank',
	disciplines: 'journal_has_academic_discipline.academic_discipline_id'
};

/**
 * The queryOptions function converts The parameters of a query (for a specific class-object)
 * to an sql query with the corresponding database fields.
 * For example : getDiscipline({parentId: 'Computer Science'}, next) where params = {parentId: 'Computer Science'},
 * the parameters will be converted to ' WHERE academic_discipline.part_of_academic_discipline_id=:parentId' 
 */
var queryOptions = function(params, classObj) {
	var query = '';
	for(var variable in params) {
		if(query === '') {
			query += ' WHERE ';
		}
		else {
			query += ' AND ';
		}
		query += classObj[variable] + '=' + ':' + variable;
	}
	//console.log('queryOptions' + query);
	return query; 
};

module.exports.disciplineRepr = disciplineRepr;
module.exports.journalRepr = journalRepr;
module.exports.personRepr = personRepr;
module.exports.queryOptions = queryOptions;
