'use strict';
var Discipline = require('./discipline.js');
var Journal = require('./journal.js');
var Person = require('./person.js');

//person
var personRepr = {
	reprTables: ['person']
};
personRepr['id'] = {
	table : personRepr.reprTables[0],
	fieldName: 'id',
	name: 'id',
	multiple: false
};
personRepr['firstName'] = {
	table: personRepr.reprTables[0],
	fieldName: 'first_name',
	name: 'firstName',
	multiple: false
};
personRepr['lastName'] = {
	table: personRepr.reprTables[0],
	fieldName: 'last_name',
	name: 'lastName',
	multiple: false
};
personRepr['reprInsert'] = [personRepr.firstName, personRepr.lastName];
personRepr['reprGet'] = [personRepr.id];
personRepr['reprNew'] = function(row) {
	var person = new Person({firstName: row.first_name, lastName: row.last_name});
	return person;
};

//discipline
var disciplineRepr = {
	reprTables: ['academic_discipline']
};
disciplineRepr['id'] = {
	table : disciplineRepr.reprTables[0],
	fieldName: 'id',
	name: 'id',
	multiple: false
};
disciplineRepr['name'] = {
	table: disciplineRepr.reprTables[0],
	fieldName: 'name',
	name: 'name',
	multiple: false
};
disciplineRepr['parentId'] = {
	table: disciplineRepr.reprTables[0],
	fieldName: 'part_of_academic_discipline_id',
	name: 'parent',
	multiple: false
};
disciplineRepr['reprInsert'] = [disciplineRepr.name, disciplineRepr.parentId];
disciplineRepr['reprGet'] = [disciplineRepr.id, {foreign: disciplineRepr.parentId, repr: disciplineRepr, id: disciplineRepr.id}];
disciplineRepr['reprNew'] = function(row) {
	var discipline = new Discipline(row.name);
	discipline.id = row.id;
	return discipline;
};

var journalRepr = {
	reprTables: ['journal', 'journal_has_academic_discipline']
};
journalRepr['id'] = {
		table: journalRepr.reprTables[0],
		fieldName: 'id',
		name: 'id',
		multiple: false
	};
journalRepr['name'] = {
		table: journalRepr.reprTables[0],
		fieldName: 'name',
		name: 'name',
		multiple: false
	};
journalRepr['rank'] = {
		table: journalRepr.reprTables[0],
		fieldName: 'rank',
		name: 'rank',
		multiple: false
	};
journalRepr['disciplines'] = {
		table: journalRepr.reprTables[1],
		fieldName: 'academic_discipline_id',
		name: 'disciplines',
		multiple: true,
		foreign: 'journal_id'
	};
journalRepr['reprInsert'] = [[journalRepr.name, journalRepr.rank], 
	             ['journal_id', journalRepr.disciplines]];
journalRepr['reprGet'] = [journalRepr.id, {foreign: journalRepr.disciplines, repr: disciplineRepr, id: disciplineRepr.id}];
journalRepr['reprNew'] = function(row) {
	var journal =  new Journal(row.name, row.rank);
	journal.id = row.id;
	return journal;
};

var queryGet = function(params, classObj) {
	var query = 'SELECT * FROM ';
	query += classObj['reprGet'][0].table;
	if(classObj['reprGet'].length > 1 && classObj['reprGet'][1].repr != classObj) {
		var currField = classObj['reprGet'][1];
		query += ' INNER JOIN ';
		query += currField.foreign.table;
		query += ' ON ';
		query += classObj['reprGet'][0].table + '.' + classObj['reprGet'][0].fieldName;
		query += ' = ';
		query += currField.foreign.table + '.' + currField.foreign.foreign;
	}
	query += queryOptions(params, classObj);

	return query;
};

/**
 * Method to generate INSERT queries based on the given linker representation.
 * For example : for a JSON journal object (with the given linker.journalRepr),
 * a list of queries will be made to insert this journal
 */
var queryInsert = function(params, classObj) {
	//list where the queries will be inserted
	var queries = [];
	//object with the parameters from the query
	var queriesOptions = {};
	//loop over each insertRepr necessary to fully insert the object
	for(var i = 0; i < classObj['reprInsert'].length; i++) {
		//current query
		var query = 'INSERT INTO ';
		//insert table
		query += classObj['reprTables'][i] + ' (';
		var queryParams = classObj['reprInsert'][i];
		var multiple = false;
		//loop over each field of the table used in the insert
		for(var j = 0; j < queryParams.length; j++) {
			if(typeof queryParams[j] === 'string') {
				query += queryParams[j];
			}
			else {
				query += queryParams[j].fieldName;
				if(queryParams[j].multiple) {
					multiple = queryParams[j];
				}
			}
			if(j < queryParams.length -1) {
				query += ', ';
			}
		}
		query += ') VALUES (';

		var multipleArray = [params[multiple.name]];
		if(multiple != false) {
			multipleArray = params[multiple.name];
		}
		//mi : multiple_index
		for(var mi = 0; mi < multipleArray.length; mi++) {
			var insertQuery = query;
			for(var j = 0; j < queryParams.length; j++) {
				if(typeof queryParams[j] === 'string') {
					insertQuery += ':id';
				}
				else {
					var paramName = queryParams[j].name + '_' + mi;
					insertQuery += ':' + paramName;
					if(multiple) {
						queriesOptions[paramName] = params[queryParams[j].name][mi].id;
					}
					else {
						queriesOptions[paramName] = params[queryParams[j].name];
					}	
				}
				if(j < queryParams.length -1) {
					insertQuery += ', ';
				}
			}
			insertQuery += ')';
			queries.push(insertQuery);
		}	
	}

	return [queries, queriesOptions];
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
		query += classObj[variable].fieldName + '=' + ':' + variable;
	}
	console.log('queryOptions' + query);
	return query; 
};

module.exports.disciplineRepr = disciplineRepr;
module.exports.journalRepr = journalRepr;
module.exports.personRepr = personRepr;
module.exports.queryOptions = queryOptions;
module.exports.queryInsert = queryInsert;
module.exports.queryGet = queryGet;