function Publication(){
  if(arguments.length == 7){
    this.title = arguments[0];
    this.numberOfPages = arguments[1];
    this.year = arguments[2];
    this.url = arguments[3];
    this.keywords = arguments[4];
    this.authors = arguments[5];
    this.disciplines = arguments[6];
  } else if(arguments.length == 1){
    var parsed = JSON.parse(arguments[0]);
    if(parsed){
      this.title = parsed.title;
      this.numberOfPages = parsed.numberOfPages;
      this.year = parsed.numberOfPages;
      this.url = parsed.url;
      this.keywords = parsed.keywords;
      this.authors = parsed.authors;
      this.disciplines = parsed.disciplines;
    } else{
      throw new Error("No JSON-file given: " + arguments[0]);
    }
  } else {
    throw new Error("Illegal amount of arguments: " + arguments.length)
  }

  this.prototype.toDB(client){
    client.querry('INSERT INTO publication(id , publication_type , title , publication_title , nr_of_pages , published_in_year , url , held_in_city_name , published_by_publisher_name , rank , published_by_user_id , summary_text, appeared_in_volume_nr , appeared_in_nr)
                   VALUES(:id , :publication_type , :title , :publication_title , :nr_of_pages , :published_in_year , :url , :held_in_city_name , :published_by_publisher_name , :rank , :published_by_user_id , :summary_text, :appeared_in_volume_nr , :appeared_in_nr)'
                   {
                     id: 12345678910;
                     publication_type: this.type;
                     title: this.title;
                     publication_title: this.title;
                     nr_of_pages: this.numberOfPages;
                     published_in_year: this.year;
                     url: this.url;
                     held_in_city_name: this.city;
                     published_by_publisher_name: this.authors;
                     rank: 1;
                     published_by_user_id: 12345678910;
                     summary_text: "test";
                     appeared_in_volume_nr: 1;
                     appeared_in_nr: 1;
                   });

    .on('error', function(err){
      console.log('Result error: ' + inspect(err));
    });

    .on('end', function(info){
      console.log('Insert succesfull');
    });
  }
}

ProceedingPublication.prototype = new Publication();
ProceedingPublication.prototype.constructor = ProceedingPublication;
function ProceedingPublication(title, numberOfPages, year, url, keywords, authors, disciplines, editors, publishers, city){
  Publication.call(this, title, numberOfPages, year, url, keywords, authors, disciplines);
  this.type = "Proceeding";
  this.editors = editors;
  this.publishers = publishers;
  this.city = city;
}

JournalPublication.prototype = new Publication();
JournalPublication.prototype.constructor = JournalPublication;
function JournalPublication(title, numberOfPages, year, url, keywords, authors, disciplines, volume, number){
  Publication.call(this, title, numberOfPages, year, url, keywords, authors, disciplines);
  this.type = "Journal";
  this.volume = volume;
  this. number = number;
}
