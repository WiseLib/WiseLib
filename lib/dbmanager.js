    this.numberOfPages = data.numberOfPages;
    this.year = data.year;
    this.url = data.url;
    this.keywords = data.keywords;
    this.authors = data.authors;
    this.disciplines = data.disciplines;
}
/**
 * Writes all variables from a publication to the database.
 * Links the publication with the authors in the database that worked on the publication.
 * Links the keywords to the publication.
 *
 * @method
 * @param {object} client An object that is the connection with the database.
 */

Publications.prototype.toDB(client){
  client.querry('INSERT INTO publication(id , publication_type , title , publication_title , nr_of_pages , published_in_year , url , held_in_city_name , published_by_publisher_name , rank , published_by_user_id , summary_text, appeared_in_volume_nr , appeared_in_nr)
  VALUES(:id , :publication_type , :title , :publication_title , :nr_of_pages , :published_in_year , :url , :held_in_city_name , :published_by_publisher_name , :rank , :published_by_user_id , :summary_text, :appeared_in_volume_nr , :appeared_in_nr)',
  {
    id: 1;
    publication_type: this.type;
    title: this.title;
    publication_title: this.title;
    nr_of_pages: this.numberOfPages;
    published_in_year: this.year;
    url: this.url;
    held_in_city_name: NULL;
    published_by_publisher_name: NULL;
    rank: 1;
    published_by_user_id: this.authors;
    summary_text: "test";
    appeared_in_volume_nr: 1;
    appeared_in_nr: 1;
  })

  .on('error', function(err){
    console.log('Insert error: ' + inspect(err));
  })

  .on('end', function(info){
    console.log('Insertion publication in database succesfull');
  });

  var authorsLength = this.authors.length;
  for(var i = 0; i < authorsLength; i++){
    client.querry('INSERT INTO publication_written_by_person(publication_id , person_id) VALUES(:publication_id , :person_id)',
    {
      publication_id: this.id;
      person_id: this.authors[i];
    })

    .on('error', function(err){
      console.log('Insert error: ' + inspect(err));
    })

    .on('end', function(info){
      console.log('Person: ' + this.authors[i] +' linked to Publication: ' + this.id);
    });
  }

  var keywordsLength = this.keywords.length;
  for(var i = 0; i < keywordsLength; i++){
    client.querry('INSERT INTO publication_has_keyword(publication_id , keyword) VALUES(:publication_id , :keyword)',
    {
      publication_id: this.id;
      keyword: this.keywords[i];
    })

    .on('error', function(err){
      console.log('Insert error: ' + inspect(err));
    })

    .on('end', function(info){
      console.log(this.keywords[i] + ' is linked to Publication: ' + this.id);
    });
  }
}var inspect = require('util').inspect;
var Client = require('mariasql');
var discipline = require('./discipline.js');

DBManager = function(host, database) {
    this.host = host;
    this.database = database;
}

DBManager.prototype.connect = function(user, password){
    var client = new Client();
    client.connect({
        host: this.host,
        user: user,
        password: password,
        db: this.database
    });

    return client;
}

DBManager.prototype.onSuccess = function(success) {
    console.log('Success : ' + success);
    return 200;
}

DBManager.prototype.onError = function(error) {
    console.log('Error : ' + error);
    return 404;
}

DBManager.prototype.executeQuery = function(user, password, query, queryParams, onSuccess, onError) {
    queryParams = (typeof queryParams === "undefined") ? {} : queryParams;
    onSuccess = (typeof onSuccess === "undefined") ? DBManager.prototype.onSuccess : onSuccess;
    onError = (typeof onError === "undefined") ? DBManager.prototype.onError : onError;
    var client = this.connect(user, password);
    var query = client.query(query, queryParams);
    var result = query.on('result', onSuccess)
        .on('error', onError);

    client.end();

    return result;
}

DBManager.prototype.getDisciplines = function(user, password, next) {
    var onSuccess = function(res) {
        var disciplines = [];
        var result = res.on('row', function(row) {
            console.log('Result row: ' + inspect(row));
            disciplines.push({id: row.id, parentId: row.part_of_academic_discipline_id});
        })
        .on('end', function(info) {
            disciplines = discipline.Discipline.parse({disciplines: disciplines});
            next(disciplines);
        });
    }
    var result = this.executeQuery(user, password, 'SELECT * FROM academic_discipline', undefined, onSuccess);
    return result;
}

DBManager.prototype.postDiscipline = function(user, password, discipline) {
    var result = this.executeQuery(user, password, 'INSERT INTO academic_discipline VALUES (:id, :part_of)', {id: discipline.id, part_of: discipline.parent.id});
    return result;
}

DBManager.prototype.getJournal = function(user, password, next, id) {
    var manager = this;
    //will be called once we got all disciplines from database
    var nextDisciplines = function(disciplines) {
        var onSuccess = function(res) {
            var journal;
            dis = [];
            res.on('row', function(row) {
                //create journal once
                if(typeof journal === "undefined") {
                    journal = new Journal(row.id, row.rank, []);
                }
                //get all journal disciplines
                dis.push(row.academic_discipline_id);
            })
            .on('end', function(info) {
                //add journal disciplines to journal
                for(var i = 0; i < disciplines.length; i++) {
                    for(var j = 0; j < dis.length; j++) {
                        if(dis[j] == disciplines[i].id) {
                            journal.disciplines.push(disciplines[i]);
                        }
                    }
                }
                //callback
                next(journal);
            });
        }
        var query = 'SELECT * FROM journal INNER JOIN journal_has_academic_discipline ' +
                    'ON journal.id = journal_has_academic_discipline.journal_id '+
                    'WHERE journal.id = :id';
        manager.executeQuery(user, password, query, {id: id}, onSuccess);
    }
    //first get disciplines
    this.getDisciplines(user, password, nextDisciplines);

}

DBManager.prototype.getJournals = function(user, password, next) {

    var query = 'SELECT id FROM journal';
    var onSuccess = function(res) {
        journals = [];
        //for each journal id, find the corresponding journal
        res.on('row', function(row) {
            this.getJournal(user, password, function(journal) {
                journals.push(journal);
            }, row.id);
        })
        .on('end', function(info) {
            next(journals);
        });
    }
    this.executeQuery(user, password, query, undefined, onSuccess);
}

DBManager.prototype.postJournal = function(user, password, journal) {
    var manager = this;
    //insert journal in table
    var query = 'INSERT INTO journal VALUES (:id, :rank)';
    var queryParams = {id: journal.id, rank: journal.rank};
    //if succeeded, insert journal disciplines
    var onSuccess = function(res) {
        //add all journal disciplines in journal_has_academic_discipline table
        for(var i = 0; i < journal.disciplines.length; i++) {
            var query = 'INSERT INTO journal_has_academic_discipline VALUES (:journal_id, :discipline_id)';
            var queryParams = {journal_id: journal.id, discipline_id: journal.disciplines[i].id};
            manager.executeQuery(user, password, query, queryParams);
        }

    }

    this.executeQuery(user, password, query, queryParams, onSuccess);
}

DBManager.prototype.postPublication = function(user, password, publication){
  var manager = this;
  var query = 'INSERT INTO publication VALUES (:publication_type ,'
                                              + ' :title ,'
                                              + ' :publication_title ,'
                                              + ' :nr_of_pages ,'
                                              + ' :published_in_year ,'
                                              + ' :url ,'
                                              + ' :published_by_user_id)'
}
//Exports
exports.DBManager = DBManager;
exports.DBManager.prototype.connect = DBManager.prototype.connect;
exports.DBManager.prototype.getDisciplines = DBManager.prototype.getDisciplines;
exports.DBManager.prototype.postDiscipline = DBManager.prototype.postDiscipline;
exports.DBManager.prototype.getJournal = DBManager.prototype.getJournal;
exports.DBManager.prototype.getJournals = DBManager.prototype.getJournals;
exports.DBManager.prototype.postJournal = DBManager.prototype.postJournal;
