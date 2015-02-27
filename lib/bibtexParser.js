var bibtexParse = require('bibtex-parse-js');
var fs = require('fs')

function parseBibtex(path){
    fs.readFile(path, 'utf8', function(err, data){
        if(err){
            return console.log(err);
        }
        bibtexToJSON(data)
    })
}

function bibtexToJSON(bibtexText){
    bibJSON = bibtexParse.toJSON(bibtexText);
    console.log(bibJSON);
}

module.exports.parseBibtex = parseBibtex;
