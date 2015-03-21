'use strict';
var bibtexParse = require('bibtex-parse-js');
var fs = require('fs');


function bibtexToJSON(bibtexText,succes){
    var bibJSON = bibtexParse.toJSON(bibtexText);
    //console.log(bibJSON);
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
