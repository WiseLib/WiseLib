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

function isCharacter(element){
	return (element != '');
}

function twoColumn(line){//receives array of string splitted on spaces

	var i = line.indexOf(isCharacter);//first character
	for (i; i < line.length; i++) {
		if((line[i] == '')&&(line[i+1] = '')){//if multiple space found
			for (i + 2; i < line.length; i++) {//check for character behind sequence of spaces
				if(line[i] != '')
					return true;
			}
			return false;
		}
	}
	return false
};


function twoColumnToOneColumn(text){
	var splittedText = text.split('\n');

	var numberOfLines =  splittedText.length;

	var firstColumn = [];
	var secondColumn = [];

	for (var i = 0; i < splittedText.length; i++){
		var line = splittedText[i].split(" ");

		if(!twoColumn(line)){
		firstColumn.push(line); //no double column
		continue;}

		firstColumn.push(line.splice(0,line.length / 2).join(' '));
		secondColumn.push(line.splice((line.length / 2),line.length).join(' '));
	};

	var newText = firstColumn.concat(secondColumn);
	//return newText;
};

function extractReferences(page_array){
	var numberOfPages = page_array.length;
	var text = page_array[numberOfPages - 1];
	splittedText = twoColumnToOneColumn(text);//in case references are in two columns
	console.log(splittedText.length); //var splittedText = text.split("\n")
	var references = []
	var reference = ''
	for (var i = 0; i < splittedText.length; i++) {
		var line = splittedText[i];
		if (line.indexOf('[') !== -1){
			reference = line.substring(line.indexOf(']') + 1)
			line = splittedText[++i];
			if (legalLine(line)) 
				while (line.indexOf('[') == -1){console.log(i)
					reference = reference + ' ' + removeMulipleSpace(line); 
					if (i + 2 > splittedText.length){break;}//end of page reached
					line = splittedText[++i];
				}
				//i--;
			}

		references.push(reference);
	};

	return references;
}

function analysePdf(path,options,callback){//callback has an array [title, auhtors, references ,path]
	var processor = pdf_extract(path, options, function(err) {
		if (err) {return console.log(err);}
	});

	processor.on('complete', function(data) {

		callback([extractTitle(data.text_pages[0]),extractAuthors(data.text_pages[0]),extractReferences(data.text_pages),data.pdf_path]);
	});

	processor.on('error', function(err) {
		return console.log(err);
	});
}


module.exports = {extractTitle : extractTitle , extractAuthors : extractAuthors , analysePdf : analysePdf};