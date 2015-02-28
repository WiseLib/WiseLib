'use strict';
var pdfExtract = require('pdf-extract');
var fs = require('fs');


function removeMulipleSpace(text){
	text = text.trim();
	return text.replace(/ +(?= )/g,'');//replace spaces by ''
}

function removeNumber(text){
	return text.replace(/[0-9]/g, '');//replace any digit by ''
}

function legalLine(text){

	if (text !== '')
		if (text.length >= 4)
			return true;
		else{return false;}
		else{return false;}
}

function extractTitle(text){//returns array with title and authors
	var splittedText = text.split('\n');

	var i =0;
	while (!legalLine(removeMulipleSpace(splittedText[i]))) //search for first line of text
		i++;
	var title = removeMulipleSpace(splittedText[i]);

	title += (' ' + removeMulipleSpace(splittedText[++i]));//title occupies one or two lines

	var result = [title,extractAuthors(splittedText,i+1)];//authors should be on line under title
	return result;
}

function extractAuthors(text,index){

		function format(text){
			text = removeNumber(text);
			text = removeMulipleSpace(text);
			text = text.replace(/and /g,'');

			var firstname= text.substr(0,text.indexOf(' '));
			var lastname = text.substr(text.indexOf(' ')+1);

			text = {firstName: firstname,lastName: lastname};

			return text;
		}

		var authors = [];

		if(legalLine(text[index])){
			var line = removeMulipleSpace(text[index]).split(',');
			line.forEach(function(entry){authors.push(format(entry));});
		}

		else if(legalLine(text[++index])){//authors only on two lines
			var line = removeMulipleSpace(text[index]).split(',');
			line.forEach(function(entry){

				authors.push(format(entry));
			});
		}
		else return ['Unknown'];
		return authors;

	}


function analysePdf(path,callback,options){//callback has an array [title, authors, number of pages ,path]

	options = (typeof options === 'undefined') ? {type : 'text'} : options;

	var processor = pdfExtract(path, options, function(err) {
		if (err) {return console.log(err);}
	});

	processor.on('complete', function(data) {
		var result = extractTitle(data.text_pages[0]);//extractTitle calls extractAuthors
		callback({title:result[0],authors:result[1],numberofpages:data.text_pages.length,path:data.pdf_path});
	});

	processor.on('error', function(err) {
		return console.log(err);
	});
}

module.exports = {analysePdf : analysePdf};