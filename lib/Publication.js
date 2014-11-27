function Publication(title, numberOfPages, year, url, keywords, authors, disciplines){
  this.title = title;
  this.numberOfPages = numberOfPages;
  this.year = year;
  this.url = url;
  this.keywords = keywords;
  this.authors = authors;
  this.disciplines = disciplines;
}

ProceedingPublication.prototype = new Publication();
ProceedingPublication.prototype.constructor = ProceedingPublication;
function ProceedingPublication(title, numberOfPages, year, url, keywords, authors, disciplines, editors, publishers, city){
  Publication.call(this, title, numberOfPages, year, url, keywords, authors, disciplines);
  this.editors = editors;
  this.publishers = publishers;
  this.city = city;
}

JournalPublication.prototype = new Publication();
JournalPublication.prototype.constructor = JournalPublication;
function JournalPublication(title, numberOfPages, year, url, keywords, authors, disciplines, volume, number){
  Publication.call(this, title, numberOfPages, year, url, keywords, authors, disciplines);
  this.volume = volume;
  this. number = number;
}
