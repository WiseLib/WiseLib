var pdf_extract = require('pdf-extract');
var fs = require('fs');


function removeMulipleSpace(text){
	return text.replace(/ +(?= )/g,'');//replace spaces by ''
}

function legalLine(text){

	if (text !== "")
		if (text.length >= 5)
			return true;
		else{return false;}
		else{return false;}
	}

function extractTitle(text){
		var splittedText = text.split("\n")

		var i =0;
		while (!legalLine(removeMulipleSpace(splittedText[i])))
			i++;
		var title = removeMulipleSpace(splittedText[i]);
		i = i+1;

		while (legalLine(removeMulipleSpace(splittedText[i])))
			title += (' ' + removeMulipleSpace(splittedText[i++]));

		return title;
	}

function extractAuthors(text){
	return ''
	}

function extractReferences(text){
	return ''
}

function analysePdf(path,options,callback){//callback has an array [title, auhtors, path]
	var processor = pdf_extract(path, options, function(err) {
		if (err) {return console.log(err);}
	});

	processor.on('complete', function(data) {

		callback([extractTitle(data.text_pages[0]),extractAuthors(data.text_pages[0]),data.pdf_path]);
	});

	processor.on('error', function(err) {
		return console.log(err);
	});
}


module.exports = {extractTitle : extractTitle , extractAuthors : extractAuthors , analysePdf : analysePdf};