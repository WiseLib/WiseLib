'use strict';
var Promise = require('bluebird');
var pdfExtract = require('pdf-extract');
var Parser = require('./parser.js');

/* Extract data from a pdf containing a publication
 * Extracted data : title, authors, numberOfPages
 * @superclass Parser
 * @constructor
 */
var PDFParser = function(arg) {
	Parser.call(this, arg);
};

PDFParser.prototype = Object.create(Parser.prototype);

/**
 * Replaces 2 or more space by empty string
 * @param  {string} text The string to edit
 * @return {string}      text with spaces removed
 */
PDFParser.prototype.removeMulipleSpace = function(text){
	text = text.trim();
	return text.replace(/ +(?= )/g,'');//replace spaces by ''
};

/**
 * Remove any number from a string
 * @param  {string} text The string that needs its numbers removed
 * @return {[type]}      text without numbers 
 */
PDFParser.prototype.removeNumber = function(text){
	return text.replace(/[0-9]/g, '');//replace any digit by ''
};

/**
 * Check if a text is a line we should parse. A line is not parsed if it is empty or to short
 * @param  {string} text The string to test
 * @return {boolean}     True if line is legal
 */
PDFParser.prototype.legalLine = function(text){

	if (text !== '')
		if (text.length >= 4)
			return true;
		else{return false;}
	else{return false;}
};

/**
 * Extracts the title from a given text. Title can span multiple lines but should not be preceded by ohter text
 * @param  {string} text The text from which the title should be extracted
 * @return {array}     	 An array containing both title and authors, as this function calls extractAuthors
 */
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

/**
 * Extracts authors from a text starting at an index. This method should never be called manually
 * @param  {array} text  An array containg lines of a text
 * @param  {int} index 	 The index indicating the starting position in the array for the search process
 * @return {array}       An array containg all extracted authors
 */
PDFParser.prototype.extractAuthors = function(text,index){
	var parser = this;
	function format(text){
		text = parser.removeNumber(text);
		text = parser.removeMulipleSpace(text);
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
/* @see Parser.extract
 */
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
			var result = pdfParser.extractTitle(data.text_pages[0]);
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
/**
 * @implements {Parser}
 * @param  {string}  mimetype 
 * @return {Boolean}          
 */
PDFParser.prototype.isSupported = function(mimetype) {
	return mimetype === 'application/pdf';
};
PDFParser.prototype.constructor = PDFParser;

module.exports = PDFParser;