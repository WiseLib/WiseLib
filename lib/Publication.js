/**
 * Creates an instance of publication
 *
 * @constructor
 * @this {Publication}
 * @param {object} data This object contains all data necessary for the construction of Publication.
 */

function Publication(data){
    this.title = data.title;
    this.numberOfPages = data.numberOfPages;
    this.year = data.year;
    this.url = data.url;
    this.keywords = data.keywords;
    this.authors = data.authors;
    this.disciplines = data.disciplines;
}

Publications.prototype.toDB(client){
  client.querry('INSERT INTO publication(id , publication_type , title , publication_title , nr_of_pages , published_in_year , url , held_in_city_name , published_by_publisher_name , rank , published_by_user_id , summary_text, appeared_in_volume_nr , appeared_in_nr)
  VALUES(:id , :publication_type , :title , :publication_title , :nr_of_pages , :published_in_year , :url , :held_in_city_name , :published_by_publisher_name , :rank , :published_by_user_id , :summary_text, :appeared_in_volume_nr , :appeared_in_nr)'
  {
    publication_type: this.type;
    title: this.title;
    publication_title: this.title;
    nr_of_pages: this.numberOfPages;
    published_in_year: this.year;
    url: this.url;
    rank: 1;
    published_by_user_id: this.authors;
    summary_text: "test";
  });

  .on('error', function(err){
    console.log('Result error: ' + inspect(err));
  });

  .on('end', function(info){
    console.log('Insertion publication in database succesfull');
  });
}

/**
 * Creates an instance of ProceedingPublication. This contains all the information
 * of a proceeding and it inherits from the class Publication.
 *
 * @class
 * @augments Publication
 * @this {ProceedingPublication}
 * @param {object} data This object contains all data necessary for the construction of ProceedingPublication.
 */
ProceedingPublication.prototype = new Publication();
ProceedingPublication.prototype.constructor = ProceedingPublication;
function ProceedingPublication(data){
  Publication.call(this, data);
  this.type = "Proceeding";
  this.editors = data.editors;
  this.publishers = data.publishers;
  this.city = data.city;
}


/**
* Creates an instance of JournalPublication. This contains all the information
* of a journal and it inherits from the class Publication.
*
* @class
* @augments Publication
* @this {JournalPublication}
* @param {object} data This object contains all data necessary for the construction of JournalPublication.
*/
JournalPublication.prototype = new Publication();
JournalPublication.prototype.constructor = JournalPublication;
function JournalPublication(data){
  Publication.call(this, data);
  this.type = "Journal";
  this.volume = data.volume;
  this.number = data.number;
}
