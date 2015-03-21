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
        relation = json[this.relations[i]];
        if(relation !== undefined) {
            //assumes all objects are given by id (and called 'id')
            queryParams[this.relations[i]] = (relation.constructor === Array) ? _.map(relation, function(rel) {return rel.id}) : {id:relation.id};
        }
    }
    return queryParams;
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
            json[this.relations[i]] = (relation.constructor === Array) ? _.map(relation, function(rel) {return {id:rel.id}}) : {id:relation.id};
        }
    }

    return json;
};

Representation.prototype.toModel = function(jsonObj) {
    var queryParams = this.format(jsonObj);
    var queryRelations = this.formatRelations(jsonObj);
    var model = new this.model(queryParams);
    console.log(JSON.stringify(queryRelations));
    for(var i in queryRelations) {
        model.related(i).attach(queryRelations[i]);
    }
    return model;
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
disciplineRepr.parentId = {
    fieldName: 'part_of_academic_discipline_id',
    name: 'parent'
};
disciplineRepr.model = AcademicDiscipline;
disciplineRepr.relations = ['parent'];

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
userRepr.personId = {
    fieldName: 'person_id',
    name: 'person'
};
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
publicationRepr.uploader = {
    fieldName: 'published_by_user_id',
    name: 'uploader'
};
publicationRepr.model = Publication;
publicationRepr.relations = ['authors'];

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

module.exports.disciplineRepr = disciplineRepr;
module.exports.journalRepr = journalRepr;
module.exports.personRepr = personRepr;
module.exports.userRepr = userRepr;
module.exports.publicationRepr = publicationRepr;
module.exports.proceedingRepr = proceedingRepr;
module.exports.publicationRepr = publicationRepr;
module.exports.journalPublicationRepr = journalPublicationRepr;
module.exports.proceedingPublicationRepr = proceedingPublicationRepr;