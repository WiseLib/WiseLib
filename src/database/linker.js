'use strict';
var _ = require('lodash');
var config = require('../config.js');
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

var Publication, Journal, Proceeding;

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
    this.relations.forEach(function(relationsItem) {
        var relation = json[relationsItem];
        if(relation !== undefined) {
            //assumes all objects are given by id (and called 'id')
            if(_.isArray(relation)) {
                queryParams[relationsItem] = _.map(relation, function(rel) {return rel.id;});
            }
            else {
                queryParams[relationsItem] = _.isEqual(relation, '') ? null : relation;
            }
            //queryParams[relationsItem] = _.isArray(relation) ? _.map(relation, function(rel) {return rel.id;}) : relation;
        }
    });
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

        var PubObj = this;

        if(parameters.length > 0 ){
            _.forEach(like, function(word) {
                _.forEach(parameters, function(param) {
                    if(PubObj[param]){
                        search.push({key: PubObj[param].fieldName, value: word});
                    }
                });
            });
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
Representation.prototype.formatSearchRelations = function(json) {
    var like = json[searchKey];
    var search = [];
    if(like !== undefined) {
        like = like.split('@');
        var temp  = like.shift();
        var parameters = like;
        like= temp;
        like = like.split(' ');
        like = _.map(like, function(word) {return '%' + word + '%';});

        if(parameters.length > 0 ){
            var PubObj = this;

            _.forEach(like, function(word) {
                _.forEach(parameters, function(param) {
                    var field = PubObj.relationSearch.indexOf(param);
                    if(field !== -1)search.push({key: PubObj.relationSearch[field], value: word});
                });
            });
        }

        else {
            for(var field in this.relationSearch) {
                var f = this.relationSearch[field];
                _.forEach(like, function(word) {
                    search.push({key: f, value: word});
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
    this.relations.forEach(function(relationsItem) {
        var relation = toParse[relationsItem];
        if(relation !== undefined) {
            //assumes all table id's are named 'id'
            //note : for non-array, should return relation.id, but returning {id: relation.id} because used in jsonManager
            if(_.isArray(relation)) {
                json[relationsItem] = _.map(relation, function(rel) {return {id:rel.id};});
            }
            else {
                json[relationsItem] = relation.id;
            }
        }
    });

    return json;
};
//only when id is given (for put, delete) because of bookshelf attach restrictions
Representation.prototype.toModel = function(jsonObj) {
    var queryParams = this.format(jsonObj);
    var queryRelations = this.formatRelations(jsonObj);
    var model = new this.model(queryParams);
    for(var i in queryRelations) {
        var relation = model.related(i);
        //for now, in bookshelf, attach only supports belongsToMany relations
        //also, in bookshelf, attach only works when id is known
        if(_.isEqual(relation.relatedData.type, 'belongsToMany')) {
            if(model.id !== undefined) {
                relation.detach();
                relation.attach(queryRelations[i]);
            }
        }
        else {
            model.set(relation.relatedData.foreignKey, queryRelations[i]);
        }
    }
    return model;
};

Representation.prototype.filterFields = function(jsonObj, query) {
    var queryParams = this.format(jsonObj);
    return query.where(queryParams);
};

Representation.prototype.filterRelations = function(jsonObj, query, superQuery) {
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
            superQuery.innerJoin(relData.joinTableName, foreignKey, relData.targetIdAttribute);
            _.forEach(queryRelations[i], function(rel) {
                //filter on foreign keys
                var w = {};
                w[otherKey] = rel;
                query = query.orWhere(w);
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
        query.andWhere(p.key, 'like', p.value);
        searchParams.forEach(function(p) {
            query.orWhere(p.key, 'like', p.value);
        });
    }
    return query;
};
//TODO
Representation.prototype.searchRelations = function(jsonObj, query, superQuery) {
    var searchRelations = this.formatSearchRelations(jsonObj);
    var model = new this.model();
    //for all searchable relations
    searchRelations.forEach(function(searchRelation) {
        //only search on relations that have not already been filtered
        if(jsonObj[searchRelation.key] === undefined) {
            //find the model of the relation
            var relatedData = model.related(searchRelation.key).relatedData;
            var otherKey = relatedData.foreignKey;
            //need an inner join
            if(_.isEqual(relatedData.type, 'belongsToMany')) {
                //make necessary joins with the relation table
                var foreignKey = relatedData.joinTableName+'.'+relatedData.foreignKey;
                otherKey = relatedData.joinTableName+'.'+relatedData.otherKey;
                superQuery.innerJoin(relatedData.joinTableName, foreignKey, model.idAttribute);
            }
            //get relation model
            var Relation = relatedData.target;
            var relationModel = new Relation();
            //search on relation fields
            jsonObj = {q:jsonObj.q.split('@')[0]};
            //var relationSearch = relationModel.representation.formatSearch(jsonObj);
            var subquery = relationModel.representation.searchFields(jsonObj, relationModel.query()).select('id');
            query = query.orWhere(otherKey, 'in', subquery);
        }
    });
    return query;
};

Representation.prototype.toQuery = function(jsonObj) {
    var queryParams = this.format(jsonObj);
    var relationParams = this.formatRelations(jsonObj);
    var model = new this.model(queryParams);
    var repr = this;
    var queryFunction = function(db) {
        var l = jsonObj.q ? 2 : 1;
        if(Object.keys(queryParams).length + Object.keys(relationParams).length >= l) {
            db.where(function() {
                repr.filterFields(jsonObj, this);
                repr.filterRelations(jsonObj, this, db);
            });
        }
        if(jsonObj.q) {
            db.andWhere(function() {
                repr.searchFields(jsonObj, this);
                repr.searchRelations(jsonObj, this, db);
            });
        }
        db.toString();
    };
    return model.query(queryFunction);
};

//discipline
var disciplineRepr = new Representation();
disciplineRepr.id = {
    fieldName: 'id',
    name: 'id'
};
disciplineRepr.name = {
    fieldName: 'name',
    name: 'name'
};
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
    },
    representation: disciplineRepr
});
disciplineRepr[searchKey] = [disciplineRepr.name];
disciplineRepr.relationSearch = [];
disciplineRepr.model = AcademicDiscipline;
disciplineRepr.relations = ['parent', 'journals', 'proceedings'];

//affiliation
var affiliationRepr = new Representation();
affiliationRepr.id = {
    fieldName: 'id',
    name: 'id'
};
affiliationRepr.name = {
    fieldName: 'name',
    name: 'name'
};

var Affiliation = bookshelf.Model.extend({
    tableName: 'affiliation',
    parent: function() {
        return this.belongsTo(Affiliation, 'part_of_affiliation_id');
    }
});
affiliationRepr[searchKey] = [affiliationRepr.name];
affiliationRepr.relationSearch = [];
affiliationRepr.model = Affiliation;
affiliationRepr.relations = ['parent'];

//Person
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
var Person = bookshelf.Model.extend({
    tableName: 'person',
    affiliation: function() {
        return this.belongsTo(Affiliation, 'part_of_affiliation_id');
    },
    disciplines: function() {
        return this.belongsToMany(AcademicDiscipline, 'person_studies_academic_discipline', 'person_id', 'academic_discipline_id');
    },
    publications: function() {
        return this.belongsToMany(Publication, 'publication_written_by_person', 'person_id', 'publication_id');
    },
    representation: personRepr
});
personRepr[searchKey] = [personRepr.firstName, personRepr.lastName];
personRepr.relationSearch = ['publications', 'affiliation'];
personRepr.model = Person;
personRepr.relations = ['publications', 'affiliation', 'disciplines'];

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
var User = bookshelf.Model.extend({
    tableName: 'user',
    person: function() {
        return this.belongsTo(Person, 'person_id');
    },
    library: function() {
        return this.belongsToMany(Publication, 'publication_in_library', 'user_id', 'publication_id');
    },
    representation: userRepr
});
userRepr[searchKey] = [userRepr.email];
userRepr.relationSearch = [];
userRepr.model = User;
userRepr.relations = ['person', 'library'];

//journal
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
var Journal = bookshelf.Model.extend({
    tableName: 'journal',
    disciplines: function() {
        return this.belongsToMany(AcademicDiscipline, 'journal_has_academic_discipline', 'journal_id', 'academic_discipline_id');
    },
    representation: journalRepr
});
journalRepr[searchKey] = [journalRepr.name];
journalRepr.relationSearch = ['disciplines'];
journalRepr.model = Journal;
journalRepr.relations = ['disciplines'];

//proceeding
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
var Proceeding = bookshelf.Model.extend({
    tableName: 'conference',
    disciplines: function() {
        return this.belongsToMany(AcademicDiscipline, 'conference_has_academic_discipline', 'conference_id', 'academic_discipline_id');
    },
    representation: proceedingRepr
});
proceedingRepr[searchKey] = [proceedingRepr.name];
proceedingRepr.relationSearch = ['disciplines'];
proceedingRepr.model = Proceeding;
proceedingRepr.relations = ['disciplines'];

//publication
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
var Publication = bookshelf.Model.extend({
    tableName: 'publication',
    uploader: function() {
        return this.belongsTo(User, 'published_by_user_id');
    },
    authors: function() {
        return this.belongsToMany(Person, 'publication_written_by_person', 'publication_id', 'person_id');
    },
    editors: function() {
        return this.belongsToMany(Person, 'publication_edited_by_person', 'publication_id', 'person_id');
    },
    references: function() {
       return this.belongsToMany(Publication, 'publication_references_publication', 'id', 'referenced_id');
    },
    unknownReferences: function() {
       return this.hasMany(UnknownPublication, 'referenced_by_id');
    },
    representation: publicationRepr
});

publicationRepr[searchKey] = [publicationRepr.title];
publicationRepr.relationSearch = ['authors'];
publicationRepr.model = Publication;
publicationRepr.relations = ['uploader', 'authors', 'editors', 'references', 'unknownReferences'];

//journalPublication
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
var JournalPublication = bookshelf.Model.extend({
    tableName: 'journal_publication',
    journal: function() {
        return this.belongsTo(Journal, 'part_of_journal_id');
    },
    representation: journalPublicationRepr
});
journalPublicationRepr[searchKey] = [];
journalPublicationRepr.relationSearch = ['journal'];
journalPublicationRepr.model = JournalPublication;
journalPublicationRepr.relations = ['journal'];
//journalPublicationRepr.super = publicationRepr;
//proceedingPublication
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
var ProceedingPublication = bookshelf.Model.extend({
    tableName: 'proceeding_publication',
    proceeding: function() {
        return this.belongsTo(Proceeding, 'part_of_conference_id');
    }
});
proceedingPublicationRepr.model = ProceedingPublication;
proceedingPublicationRepr.relations = ['proceeding'];
//proceedingPublicationRepr.super = publicationRepr;


// unknownPersonPublication

var unknownPublicationRepr = new Representation();
unknownPublicationRepr.id = {
    fieldName: 'id',
    name: 'id'
};
unknownPublicationRepr.title = {
    fieldName: 'title',
    name: 'title'
};
unknownPublicationRepr.authors = {
    fieldName: 'authors',
    name: 'authors'
};
var UnknownPublication = bookshelf.Model.extend({
    tableName: 'unknown_publication',
    reference: function() {
        return this.belongsTo(Publication, 'referenced_by_id');
    },
    representation: unknownPublicationRepr
});
unknownPublicationRepr.model = UnknownPublication;
unknownPublicationRepr.relations = ['reference'];
unknownPublicationRepr[searchKey] = [unknownPublicationRepr.title];


module.exports.searchKey = searchKey;
module.exports.affiliationRepr = affiliationRepr;
module.exports.disciplineRepr = disciplineRepr;
module.exports.journalRepr = journalRepr;
module.exports.affiliationRepr = affiliationRepr;
module.exports.personRepr = personRepr;
module.exports.userRepr = userRepr;
module.exports.publicationRepr = publicationRepr;
module.exports.proceedingRepr = proceedingRepr;
module.exports.publicationRepr = publicationRepr;
module.exports.journalPublicationRepr = journalPublicationRepr;
module.exports.proceedingPublicationRepr = proceedingPublicationRepr;
module.exports.unknownPublicationRepr = unknownPublicationRepr;
