'use strict';

var fs = require('fs');
var pdfanalyser = require('./pdf_analyse.js');
var bibtexparser = require('./bibtexParser.js');

function handleFile(request,wrongTypeError,onEnd){

	var file = request.files.file
	var path = file.path;

	if(file.mimetype == 'application/pdf'){

		pdfanalyser.analysePdf(path,onEnd)

	}

	else if (file.mimetype == 'text/x-bibtex'){//save bib-tex files??
				bibtexparser.parseBibtex(path);
				//extract references
				onEnd('done');
			}

	else{
		wrongTypeError();
		};

}


		module.exports.handleFile = handleFile;
