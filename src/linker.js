'use strict';
var _ = require('lodash');
var config = require('./config.js');
config = config.database;

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host     : config.host,
        user     : config.user,
        password : config.password,
        database : config.db,
        charset  : 'utf8'
    }
});

var bookshelf = require('bookshelf')(knex);
var searchKey = 'q';

var Representation = function() {};
Representation.prototype.relations = [];
Representation.prototype.format = function(json) {
    var queryParams = {};
    for(var variable in this) {
        if(json[this[variable].name] !== undefined) {
            queryParams[this[variable].fieldName] = json[this[variable].name];
        }
    }

    return queryParams;
};
Representation.prototype.formatRelations = function(json) {
    var queryParams = {};
    for(var i=0; i < this.relations.length; i++) {
        var relation = json[this.relations[i]];
        if(relation !== undefined) {
            //assumes all objects are given by id (and called 'id')
            queryParams[this.relations[i]] = (relation.constructor === Array) ? _.map(relation, function(rel) {return rel.id;}) : relation;
        }
    }
    return queryParams;
};
Representation.prototype.formatSearch = function(json) {
    var like = json[searchKey];
    var search = [];
    if(like !== undefined) {
        like = like.split('@');
        var temp  = like.shift();
        var parameters = like;
        like= temp;
        like = like.split(' ');
        like = _.map(like, function(word) {return '%' + word + '%';});

        var thisthis = this; //rare bug hij kent this niet in de lodash for each??

        if(parameters.length > 0 ){
            _.forEach(like, function(word) {
                _.forEach(parameters, function(param) {
                    if(thisthis[param])search.push({key: thisthis[param].fieldName, value: word});})
            })
        }

        else {  
            for(var field in this[searchKey]) {
                var f = this[searchKey][field];
                _.forEach(like, function(word) {
                    search.push({key: f.fieldName, value: word});
                });
            }
        }
    }
    return search;
};
Representation.prototype.parse = function(toParse) {
    var json = {};
    for(var variable in this) {
        if(toParse[this[variable].fieldName] !== undefined) {
            json[this[variable].name] = toParse[this[variable].fieldName];
        }
    }
    for(var i=0; i < this.relations.length; i++) {
        var relation = toParse[this.relations[i]];
        if(relation !== undefined) {
            //assumes all table id's are named 'id'
            //note : for non-array, should return relation.id, but returning {id: relation.id} because used in jsonManager
            json[this.relations[i]] = (relation.constructor === Array) ? _.map(relation, function(rel) {return {id:rel.id};}) : relation.id;
        }
    }

    return json;
};
//only when id is given (for put, delete) because of bookshelf attach restrictions
Representation.prototype.toModel = function(jsonObj) {
    var queryParams = this.format(jsonObj);
    var queryRelations = this.formatRelations(jsonObj);
    var model = new this.model(queryParams);
    //console.log(JSON.stringify(queryRelations));
    for(var i in queryRelations) {
        model.related(i).attach(queryRelations[i]);
    }
    return model;
};

Representation.prototype.filterFields = function(jsonObj, query) {
    var queryParams = this.format(jsonObj);
    return query.where(queryParams);
};

Representation.prototype.filterRelations = function(jsonObj, query) {
    var queryRelations = this.formatRelations(jsonObj);
    var model = new this.model();
    //for each given relation in filter
    for(var i in queryRelations) {
        var relData = model.related(i).relatedData;
        var foreignKey = relData.foreignKey;
        //belongsToMany
        //means it is in a separate table
        if(_.isArray(queryRelations[i])) {
            //make a join with the table
            foreignKey = relData.joinTableName+'.'+foreignKey;
            var otherKey = relData.joinTableName+'.'+relData.otherKey;
            query.innerJoin(relData.joinTableName, foreignKey, relData.targetIdAttribute);
            _.forEach(queryRelations[i], function(rel) {
                //filter on foreign keys
                var w = {};
                w[otherKey] = rel;
                query = query.andWhere(w);
            });
        }
        //belongsTo
        //means it is a field in the model table
        else {
            //filter on this field
            var w = {};
            w[foreignKey] = queryRelations[i];
            query = query.andWhere(w);
        }
    }

    return query;
};

Representation.prototype.searchFields = function(jsonObj, query) {
    var searchParams = this.formatSearch(jsonObj);
    if(searchParams.length > 0) {
        var p = searchParams[0];
        query = query.andWhere(p.key, 'like', p.value);
        for(var i=1; i < searchParams.length; i++) {
            p = searchParams[i];
            query = query.orWhere(p.key, 'like', p.value);
        }
    }

    return query;
};
//TODO
Representation.prototype.searchRelations = function(jsonObj, query) {
    return query
};

Representation.prototype.toQuery = function(jsonObj) {
    var queryParams = this.format(jsonObj);
    var model = new this.model(queryParams);
    var repr = this;
    var queryFunction = function(db) {
        var query = repr.filterFields(jsonObj, db);
        query = repr.filterRelations(jsonObj, query);
        query = repr.searchFields(jsonObj, query);
        query = repr.searchRelations(jsonObj, query);
    };
    return model.query(queryFunction);
};

//discipline
var AcademicDiscipline = bookshelf.Model.extend({
    tableName: 'academic_discipline',
    parent: function() {
        return this.belongsTo(AcademicDiscipline, 'part_of_academic_discipline_id');
    },
    journals: function() {
        return this.belongsToMany(Journal, 'journal_has_academic_discipline', 'academic_discipline_id', 'journal_id');
    },
    proceedings: function() {
        return this.belongsToMany(Proceeding, 'conference_has_academic_discipline', 'academic_discipline_id', 'conference_id');
    }
});
var disciplineRepr = new Representation();
disciplineRepr.id = {
    fieldName: 'id',
    name: 'id'
};
disciplineRepr.name = {
    fieldName: 'name',
    name: 'name'
};
disciplineRepr[searchKey] = [disciplineRepr.name];
disciplineRepr.model = AcademicDiscipline;
disciplineRepr.relations = ['parent', 'journals', 'proceedings'];

//affiliation
var Affiliation = bookshelf.Model.extend({
    tableName: 'affiliation',
    parent: function() {
        return this.belongsTo(Affiliation, 'part_of_affiliation_id');
    }
});

//person
var Person = bookshelf.Model.extend({
    tableName: 'person',
    affiliation: function() {
        return this.belongsTo(Affiliation, 'part_of_affiliation_id');
    },
    publications: function() {
        return this.belongsToMany(Publication, 'publication_written_by_person', 'person_id', 'publication_id');
    }
});
var personRepr = new Representation();
personRepr.id = {
    fieldName: 'id',
    name: 'id'
};
personRepr.firstName = {
    fieldName: 'first_name',
    name: 'firstName'
};
personRepr.lastName = {
    fieldName: 'last_name',
    name: 'lastName'
};
personRepr.picture = {
    fieldName: 'picture',
    name: 'picture'
};
personRepr[searchKey] = [personRepr.firstName, personRepr.lastName];
personRepr.model = Person;
personRepr.relations = ['publications'];

//user
var User = bookshelf.Model.extend({
    tableName: 'user',
    person: function() {
        return this.belongsTo(Person, 'person_id');
    }
});
//User
var userRepr = new Representation();
userRepr.id = {
    fieldName: 'id',
    name: 'id'
};
userRepr.email = {
    fieldName: 'email_address',
    name: 'email'
};
userRepr.password = {
    fieldName: 'password',
    name: 'password'
};
userRepr[searchKey] = [userRepr.email];
userRepr.model = User;
userRepr.relations = ['person'];

//journal
var Journal = bookshelf.Model.extend({
    tableName: 'journal',
    disciplines: function() {
        return this.belongsToMany(AcademicDiscipline, 'journal_has_academic_discipline', 'journal_id', 'academic_discipline_id');
    }
});
var journalRepr = new Representation();
journalRepr.id = {
    fieldName: 'id',
    name: 'id'
};
journalRepr.name = {
    fieldName: 'name',
    name: 'name'
};
journalRepr.rank = {
    fieldName: 'rank',
    name: 'rank'
};
journalRepr[searchKey] = [journalRepr.name];
journalRepr.model = Journal;
journalRepr.relations = ['disciplines'];

//proceeding
var Proceeding = bookshelf.Model.extend({
    tableName: 'conference',
    disciplines: function() {
        return this.belongsToMany(AcademicDiscipline, 'conference_has_academic_discipline', 'conference_id', 'academic_discipline_id');
    }
});
var proceedingRepr = new Representation();
proceedingRepr.id = {
    fieldName: 'id',
    name: 'id'
};
proceedingRepr.name = {
    fieldName: 'name',
    name: 'name'
};
proceedingRepr.rank = {
    fieldName: 'rank',
    name: 'rank'
};
proceedingRepr[searchKey] = [proceedingRepr.name];
proceedingRepr.model = Proceeding;
proceedingRepr.relations = ['disciplines'];

//publication
var Publication = bookshelf.Model.extend({
    tableName: 'publication',
    uploader: function() {
        return this.belongsTo(User, 'published_by_user_id');
    },
    authors: function() {
        return this.belongsToMany(Person, 'publication_written_by_person', 'publication_id', 'person_id');
    }
});
var publicationRepr = new Representation();
publicationRepr.id = {
    fieldName: 'id',
    name: 'id'
};
publicationRepr.title = {
    fieldName: 'title',
    name: 'title'
};
publicationRepr.type = {
    fieldName: 'publication_type',
    name: 'type'
};
publicationRepr.numberOfPages = {
    fieldName: 'nr_of_pages',
    name: 'numberOfPages'
};
publicationRepr.year = {
    fieldName: 'published_in_year',
    name: 'year'
};
publicationRepr.url = {
    fieldName: 'url',
    name: 'url'
};
publicationRepr.abstract = {
    fieldName: 'summary_text',
    name: 'abstract'
};
publicationRepr[searchKey] = [publicationRepr.title];
publicationRepr.model = Publication;
publicationRepr.relations = ['uploader', 'authors'];

//journalPublication
var JournalPublication = bookshelf.Model.extend({
    tableName: 'journal_publication',
    super: function() {
        return this.belongsTo(Publication, 'id');
    },
    journal: function() {
        return this.belongsTo(Journal, 'part_of_journal_id');
    }
});
var journalPublicationRepr = new Representation();
journalPublicationRepr.id = {
    fieldName: 'id',
    name: 'id'
};
journalPublicationRepr.volume = {
    fieldName: 'appeared_in_volume_nr',
    name: 'volume'
};
journalPublicationRepr.number = {
    fieldName: 'appeared_in_nr',
    name: 'number'
};
journalPublicationRepr.journal = {
    fieldName: 'part_of_journal_id',
    name:'journal'
};
journalPublicationRepr.model = JournalPublication;
//proceedingPublication
var ProceedingPublication = bookshelf.Model.extend({
    tableName: 'proceeding_publication',
    super: function() {
        return this.belongsTo(Publication, 'id');
    },
    proceeding: function() {
        return this.belongsTo(Proceeding, 'part_of_conference_id');
    }
});
var proceedingPublicationRepr = new Representation();
proceedingPublicationRepr.id = {
    fieldName: 'id',
    name: 'id'
};
proceedingPublicationRepr.publisher = {
    fieldName: 'publisher',
    name: 'published_by_person_id'
};
proceedingPublicationRepr.city = {
    fieldName: 'held_in_city_name',
    name: 'city'
};
proceedingPublicationRepr.proceeding = {
    fieldName: 'part_of_conference_id',
    name:'proceeding'
};
proceedingPublicationRepr.model = ProceedingPublication;

module.exports.searchKey = searchKey;
module.exports.disciplineRepr = disciplineRepr;
module.exports.journalRepr = journalRepr;
module.exports.personRepr = personRepr;
module.exports.userRepr = userRepr;
module.exports.publicationRepr = publicationRepr;
module.exports.proceedingRepr = proceedingRepr;
module.exports.publicationRepr = publicationRepr;
module.exports.journalPublicationRepr = journalPublicationRepr;
module.exports.proceedingPublicationRepr = proceedingPublicationRepr;