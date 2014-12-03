/**
 * Creates an instance of publication
 *
 * @constructor
 * @this {Publication}
 * @param {object} data This object contains all data necessary for the construction of Publication.
 * @param {string} data.title Contains the title of the publication.
 * @param {number} data.numberOfPages Contains the number of pages the publication has.
 * @param {number} data.year Contains the year when the publication was published.
 * @param {string} data.string Contains the location of the publication.
 * @param {array} data.keywords Contains the keywords linked to the publication.
 * @param {array} data.authors Contains the ID's of all the authors.
 * @param {array} data.disciplines Contains all the disciplines of the publication.
 */

function Publication(data){
    this.id = data.id;
    this.title = data.title;
    this.numberOfPages = data.numberOfPages;
    this.year = data.year;
    this.url = data.url;

    var keywordsLength = keywords.length;
    var keywordsArray = new Array[keywordsLength - 1];
    for(i = 0; i < keywordsLength; i++){
      keywordsArray[i] = data.keywords[i].id;
    }
    this.keywords = keywordsArray;

    var authorsLength = authors.length;
    var authorsArray = new Array[authorsLength - 1];
    for(i = 0; i < authorsLength; i++){
      authorsArray[i] = data.authors[i].id;
    }
    this.authors = authorsArray;

    var disciplinesLength = disciplines.length;
    var disciplinesArray = Array[disciplinesLength - 1];
    for(i = 0; i < disciplinesLength; i++){
      disciplinesArray[i] = data.disciplines[i].id;
    }
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
}

/**
 * Creates an instance of ProceedingPublication. This contains all the information
 * of a proceeding and it inherits from the class Publication.
 *
 * @class
 * @augments Publication
 * @this {ProceedingPublication}
 * @param {object} data This object contains all data necessary for the construction of ProceedingPublication.
 * @param {string} data.title Contains the title of the publication. Necessary for construction Publication.
 * @param {number} data.numberOfPages Contains the number of pages the publication has. Necessary for construction Publication.
 * @param {number} data.year Contains the year when the publication was published. Necessary for construction Publication.
 * @param {string} data.string Contains the location of the publication. Necessary for construction Publication.
 * @param {array} data.keywords Contains the keywords linked to the publication. Necessary for construction Publication.
 * @param {array} data.authors Contains the ID's of all the authors. Necessary for construction Publication.
 * @param {array} data.disciplines Contains all the disciplines of the publication. Necessary for construction Publication.
 * @param {string} data.editors Contains the name of the company who edited the proceeding.
 * @param {string} data.publishers Contains the name of the company who published the proceeding.
 * @param {string} data.city Contains the name of the city where the conference was held.
 */
ProceedingPublication.prototype = new Publication();
ProceedingPublication.prototype.constructor = ProceedingPublication;
function ProceedingPublication(data){
  Publication.call(this, data);
  this.type = "Proceeding";
  this.editor = data.editor;
  this.publisher = data.publisher;
  this.city = data.city;
}

/**
 * Links the editors of the publication to the publication.
 *
 * @method
 * @param {object} client The link to the database.
 */

ProceedingPublication.prototype.toDB(client){
  Publication.prototype.toDB(this, client);
  var editorsLength = this.editors.length;
  for(var i = 0; i < editorsLength; i++){
    client.querry('INSERT INTO publication_edited_by_person(publication_id , person_id) VALUES(:publication_id , :person_id)',
    {
      publication_id: this.id;
      person_id: this.editors[i];
    })

    .on('error', function(err){
      console.log('Insert error: ' + inspect(err));
    })

    .on('end', function(info){
      console.log('Person: '+this.editors[i] + ' is linked as editor to Publication: ' + this.id);
    });
  }

}


/**
* Creates an instance of JournalPublication. This contains all the information
* of a journal and it inherits from the class Publication.
*
* @class
* @augments Publication
* @this {JournalPublication}
* @param {object} data This object contains all data necessary for the construction of JournalPublication.
* @param {string} data.title Contains the title of the publication. Necessary for construction Publication.
* @param {number} data.numberOfPages Contains the number of pages the publication has. Necessary for construction Publication.
* @param {number} data.year Contains the year when the publication was published. Necessary for construction Publication.
* @param {string} data.string Contains the location of the publication. Necessary for construction Publication.
* @param {array} data.keywords Contains the keywords linked to the publication. Necessary for construction Publication.
* @param {array} data.authors Contains the ID's of all the authors. Necessary for construction Publication.
* @param {array} data.disciplines Contains all the disciplines of the publication. Necessary for construction Publication.
* @param {number} data.volume Contains the number of the volume in which the journal appeared.
* @param {number} data.number Contains the number in which the journal appeared.
*/
JournalPublication.prototype = new Publication();
JournalPublication.prototype.constructor = JournalPublication;
function JournalPublication(data){
  Publication.call(this, data);
  this.type = "Journal";
  this.volume = data.volume;
  this.number = data.number;
}


JournalPublication.prototype.toDB(client){
  Publication.prototype.toDB(this, client);


}
