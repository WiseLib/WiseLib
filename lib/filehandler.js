'use strict';

var fs = require('fs');
var pdfanalyser = require('./pdf_analyse.js');
var bibtexparser = require('./bibtexParser.js');

function handleFile(request,wrongTypeError,onEnd){

	var file = request.files.file;
	var path = file.path;

	if(file.mimetype === 'application/pdf'){
		pdfanalyser.analysePdf(path,onEnd);
	}


	else if (file.mimetype == 'text/x-bibtex'){
				bibtexparser.parseBibtex(path,onEnd);
			}

	else{
		wrongTypeError();
	}

}
module.exports.handleFile = handleFile;

