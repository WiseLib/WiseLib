'use strict';

var fs = require('fs');
var pdfanalyser = require('./pdf_analyse.js')

function handleFile(request,wrongTypeError,onEnd){

	var file = request.files.file
	var path = file.path;

	if(file.mimetype == 'application/pdf'){

		pdfanalyser.analysePdf(path,onEnd)

	}

	else if (file.mimetype == 'text/x-bibtex'){//save bib-tex files??

				//extract references
				onEnd('done');
			}

	else{
		wrongTypeError();
		};

}


		module.exports.handleFile = handleFile;