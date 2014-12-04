var inspect = require('util').inspect;
var Client = require('mariasql');
var Discipline = require('./discipline.js');

var DBManager = function(config) {
    this.host = config.host;
    this.database = config.database;
    this.user = config.user;
    this.password = config.password;
};

DBManager.prototype.connect = function(){
    var client = new Client();
    client.connect({
        host: this.host,
        user: this.user,
        password: this.password,
        db: this.database
    });

    return client;
};

DBManager.prototype.onSuccess = function(success) {
    console.log('Success : ' + success);
    return 200;
};

DBManager.prototype.onError = function(error) {
    console.log('Error : ' + error);
    return 404;
};

DBManager.prototype.executeQuery = function(query, queryParams, onSuccess, onError) {
    queryParams = (typeof queryParams === "undefined") ? {} : queryParams;
    onSuccess = (typeof onSuccess === "undefined") ? DBManager.prototype.onSuccess : onSuccess;
    onError = (typeof onError === "undefined") ? DBManager.prototype.onError : onError;
    var client = this.connect();
    var query = client.query(query, queryParams);
    var result = query.on('result', onSuccess)
        .on('error', onError);

    client.end();

    return result;
};

DBManager.prototype.getDisciplines = function(next) {
    var onSuccess = function(res) {
        var discObj = {};
        var discArr = [];
        var discPar = [];
        var result = res.on('row', function(row) {
            console.log('Result row: ' + inspect(row));
            var disc = new Discipline(row.id);
            discObj[row.id] = disc;
            discArr.push(disc)
            discPar.push(row.part_of_academic_discipline_id);
        })
        .on('end', function(info) {
            for(var i = 0; i < discArr.length; i++) {
                discArr[i].addChild(discObj[discPar[i]]);
            }
            next(discArr);
        });
    }
    var result = this.executeQuery('SELECT * FROM academic_discipline', undefined, onSuccess);
    return result;
};

DBManager.prototype.postDiscipline = function(discipline) {
    var result = this.executeQuery('INSERT INTO academic_discipline VALUES (:id, :part_of)', {id: discipline.id, part_of: discipline.parent.id});
    return result;
};

DBManager.prototype.deleteDiscipline = function(discipline) {
    var result = this.executeQuery('DELETE FROM academic_discipline WHERE id=:id', {id: discipline.id});
}

DBManager.prototype.getJournal = function(next, id) {
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
        manager.executeQuery(query, {id: id}, onSuccess);
    }
    //first get disciplines
    this.getDisciplines(nextDisciplines);

};

DBManager.prototype.getJournals = function(next) {

    var query = 'SELECT id FROM journal';
    var onSuccess = function(res) {
        journals = [];
        //for each journal id, find the corresponding journal
        res.on('row', function(row) {
            this.getJournal(function(journal) {
                journals.push(journal);
            }, row.id);
        })
        .on('end', function(info) {
            next(journals);
        });
    }
    this.executeQuery(query, undefined, onSuccess);
};

DBManager.prototype.postJournal = function(journal) {
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
            manager.executeQuery(query, queryParams);
        }

    }

    this.executeQuery(query, queryParams, onSuccess);
};


/**
 * Posts a publication into the database and links the ID's of the authors and the keywords
 * in the database to the ID of the publication.
 *
 * @method
 * @param {object} publication This is the object that contains all information of the publication.
 */
DBManager.prototype.postPublication = function(publication){
  var query = 'INSERT INTO publication VALUES (:publication_type , :title ,'
                                              + ' :publication_title , :nr_of_pages ,'
                                              + ' :published_in_year , :url ,'
                                              + ' :published_by_user_id , :summary_text)';
  var queryParams = {publication_type: publication.type, title: publication.title,
                     publication_title: 'DUMMY', nr_of_pages: publication.numberOfPages,
                     published_in_year: publication.year, url: publication.url,
                     published_by_user_id: publication.id, summary_text: 'TEST_SUMMARY'};

  var onSucces = function(res) {
    for(var i = 0; i < publication.authors.length; i++){
      var query = 'INSERT INTO publication_written_by_person VALUES (:publication_id , :person_id)';
      var queryParams = {publication_id: publication.id, publication.authors[i].id};
      manager.executeQuery(query, queryParams);
    }

    for(var i = 0; i < publication.keywords.length; i++) {
      var query = 'INSERT INTO publication_has_keyword VALUES (:publication_id , :keyword)';
      var queryParams = {publication_id: publication.id, publication.keywords[i].id};
      manager.executeQuery(query, queryParams);
    }
  }

  this.executeQuery(query, queryParams, onSucces);
}

/**
 * This posts a journal publication into the database. Because the journal publication
 * is a subclass of publication it first post itself as a publication in the database
 * and then it fils in the extra jounal_publication. It is linked by ID to the publication in
 * the database.
 *
 * @method
 * @param {object} journal It contains an object which contains all data of a journalPublication.
 */
DBManager.prototype.postJournalPublication = function(journal){
  this.postPublication(journal);
  var query = 'INSERT INTO journal_publication VALUES (:id , :appeared_in_nr , :appeared_in_volume_nr)';
  var queryParams = {id: journal.id, appeared_in_nr: journal.number, appeared_in_volume_nr: journal.volume };
  this.executeQuery(query, queryParams);
}

/**
* This posts a proceeding publication into the database. Because the proceeding publication
* is a subclass of publication it first post itself as a publication in the database
* and then it fils in the extra proceeding_publication. It is linked by ID to the publication in
* the database.
*
* @method
* @param {object} proceeding It contains an object which contains all data of a proceedingPublication.
*/
DBManager.prototype.postProceedingPublication = function(proceeding) {
  this.postPublication(proceeding);
  var query = 'INSERT INTO proceeding_publication VALUES (:id , :held_in_city_name , :published_by_person)';
  var queryParams = {id: proceeding.id, held_in_city_name: proceeding.city, published_by_person: 'THE COMPANY'};
  this.executeQuery(query, queryParams)
}
//Exports
module.exports = DBManager;
