var bibtexParse = require('bibtex-parse-js');
var fs = require('fs')

function parseBibtex(path,succes){
    fs.readFile(path, 'utf8', function(err, data){
        if(err){
            return console.log(err);
        }
        bibtexToJSON(data,succes)
    })
}

function bibtexToJSON(bibtexText,succes){
    bibJSON = bibtexParse.toJSON(bibtexText);
    //console.log(bibJSON);
    succes(bibJSON);
}

module.exports.parseBibtex = parseBibtex;
