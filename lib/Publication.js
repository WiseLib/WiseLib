/**
 * Creates an instance of publication
 *
 * @constructor
 * @this {Publication}
 * @param {string} title The title of the publication.
 * @param {number} numberOfPages The number of pages the publication has.
 * @param {string} url The location of the publication.
 * @param {array} keywords It contains all the tags of the publication.
 * @param {array} authors It contains all ID's of the authors who published it.
 * @param {array} disciplines It contains all the disciplines from the publication.
 */

function Publication(title, numberOfPages, year, url, keywords, authors, disciplines){
    this.title = title;
    this.numberOfPages = numberOfPages;
    this.year = year;
    this.url = url;
    this.keywords = keywords;
    this.authors = authors;
    this.disciplines = disciplines;
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
 * @constructor
 * @this {ProceedingPublication}
 * @param {string} title The title of the proceeding.
 * @param {number} numberOfPages The number of pages the proceeding has.
 * @param {string} url The location of the proceeding.
 * @param {array} keywords It contains all the tags of the proceeding.
 * @param {array} authors It contains all ID's of the authors who published it.
 * @param {array} disciplines It contains all the disciplines from the proceeding.
 * @param {array} editors It contains the ID's of all the editors.
 * @param {array} publishers It contains the ID's of all the publishers.
 * @param {string} city The city where the proceeding was held.
 */
ProceedingPublication.prototype = new Publication();
ProceedingPublication.prototype.constructor = ProceedingPublication;
function ProceedingPublication(){
  if(arguments.length == 10){
    Publication.call(this, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
    this.type = "Proceeding";
    this.editors = editors;
    this.publishers = publishers;
    this.city = city;
  } else if(arguments.length == 1){
    var parsed = JSON.parse(arguments[0]);
    if(parsed){
      Publication.call(this, parsed.title, parsed.numberOfPages, parsed.year, parsed.url, parsed.keywords, parsed.authors, parsed.disciplines);
      this.type = "Proceeding";
      this.editors = parsed.editors;
      this.publishers = parsed.publishers;
      this.city = parsed.city;
    } else {
      throw new Error("Argument is not a JSON-file: " + arguments[0]);
    }
  } else {
    throw new Error("Invalid amount of arguments: " + arguments.length);
  }
}

JournalPublication.prototype = new Publication();
JournalPublication.prototype.constructor = JournalPublication;
function JournalPublication(){
  if(arguments.length == 9){
    Publication.call(this, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
    this.type = "Journal";
    this.volume = volume;
    this. number = number;
  } else if(arguments.length == 1){
    var parsed = JSON.parse(arguments[0]);
    if(parsed){
      Publication.call(this, parsed.title, parsed.numberOfPages, parsed.year, parsed.url, parsed.keywords, parsed.authors, parsed.disciplines);
      this.type = "Journal";
      this.editors = parsed.volume;
      this.publishers = parsed.number;
      this.city = parsed.city;
    } else {
      throw new Error("Argument is not a JSON-file: " + arguments[0]);
    }
  } else {
    throw new Error("Invalid amount of arguments: " + arguments.length);
  }
}
