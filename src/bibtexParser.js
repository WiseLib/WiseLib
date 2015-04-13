'use strict'
var bibtexParse = require('bibtex-parse-js');
var fs = require('fs');

function bibtexToJSON(bibtexText,succes){
    var lowerBibTex = bibtexText.toLowerCase();
    var bibJSON = bibtexParse.toJSON(lowerBibTex);
    console.log(bibJSON);
    succes(bibJSON);
}

function parseBibtex(path,succes){
    fs.readFile(path, 'utf8', function(err, data){
        if(err){
            return console.log(err);
        }
        bibtexToJSON(data,succes);
    });
}

module.exports.parseBibtex = parseBibtex;
