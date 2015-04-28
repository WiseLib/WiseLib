'use strict';
var pdfExtract = require('pdf-extract');
var Promise = require('bluebird');
var Parser = require('./parser.js');
var Publication = require('./publication.js');


var PDFParser = function(arg) {
	Parser.call(this, arg);
};

PDFParser.prototype = Object.create(Parser.prototype);

PDFParser.prototype.removeMulipleSpace = function(text){
	text = text.trim();
	return text.replace(/ +(?= )/g,'');//replace spaces by ''
};

PDFParser.prototype.removeNumber = function(text){
	return text.replace(/[0-9]/g, '');//replace any digit by ''
};

PDFParser.prototype.legalLine = function(text){

	if (text !== '')
		if (text.length >= 4)
			return true;
		else{return false;}
		else{return false;}
};

PDFParser.prototype.extractTitle = function(text){//returns array with title and authors
	var splittedText = text.split('\n');

	var i =0;
	while (!this.legalLine(this.removeMulipleSpace(splittedText[i]))) //search for first line of text
		i++;
	var title = this.removeMulipleSpace(splittedText[i]);

	title += (' ' + this.removeMulipleSpace(splittedText[++i]));//title occupies one or two lines

	var result = [title,this.extractAuthors(splittedText,i+1)];//authors should be on line under title
	return result;
};

PDFParser.prototype.extractAuthors = function(text,index){
	function format(text){
		text = this.removeNumber(text);
		text = this.removeMulipleSpace(text);
		text = text.replace(/and /g,'');

		var firstname= text.substr(0,text.indexOf(' '));
		var lastname = text.substr(text.indexOf(' ')+1);

		text = {firstName: firstname,lastName: lastname};

		return text;
	}

	var authors = [];

	if(this.legalLine(text[index])){
		var line = this.removeMulipleSpace(text[index]).split(',');
		line.forEach(function(entry){authors.push(format(entry));});
	}

	else if(this.legalLine(text[++index])){//authors only on two lines
		var line = this.removeMulipleSpace(text[index]).split(',');
		line.forEach(function(entry){

			authors.push(format(entry));
		});
	}
	else return ['Unknown'];
	return authors;

};

PDFParser.prototype.extract = function(options) {
	var pdfParser = this;
	options = (typeof options === 'undefined') ? {type : 'text'} : options;

	var processor = pdfExtract(pdfParser.path, options, function(err) {
		if (err) {
			return console.log(err);
		}
	});
	return new Promise(function(resolve, reject) {
		processor.on('complete', function(data) {
			var result = pdfParser.extractTitle(data.text_pages[0]);//extractTitle calls extractAuthors
			var publication = {title:result[0],
				               authors:result[1],
				               numberofpages:data.text_pages.length,
				               path:data.pdf_path};
			resolve(publication);
		});
		processor.on('error', function(err) {
			reject(err);
		});
	});
};
PDFParser.prototype.isSupported = function(mimetype) {
	return mimetype === 'application/pdf';
};
PDFParser.prototype.constructor = PDFParser;

module.exports = PDFParser;