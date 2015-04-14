var DBManager = require('./dbmanager.js');
var linker = require('./linker.js');
var Promise = require('bluebird');

function link(req, next){
    var references = req.references;
    var resultId = [];
    //Alle references moeten afgegaan worden en gezocht worden in de database
    searchDB(references[0], next);

}

function searchDB(reference, next){
    var DbJson = bibToDb(reference);
    DBManager.get({title: DbJson.title}, linker.publicationRepr, function(id){
        console.log("RESULT GET: " + results);
        if(results.length = 1){
            console.log("KNOWN PUBLICATION");
            next(id);
        } else {
            postUnknownPublication(reference, next);
        };
    })}

function postUnknownPublicationr(reference, next){
    //post publication with unknown person
    var authors = getAuthorNames(reference);
    for(index = 0; authors.names[index].lastname != null; index++){
        reference.unknownAuthors.push(authors.names[index]);
    };
    DBManager.post(reference, linker.publicationRepr, function(id){
        console.log("ID: " + id);
        next(id);
    });
}


function getAuthorNames(reference){
    var authors = reference.entryTags.author;
    var authorNames = authors.split(' and ');
    var data = {names: []};
    for(index = 0; index < authorNames.length; index++){
        var name = authorNames[index].split(', ');
        if(name.length < 2){
            data.names.push({lastName: name[0], firstName: " "});
        } else {
            data.names.push({lastName: name[0], firstName: name[1]});
        }
    }
    return data;
}

function bibToDb(reference){
    var data = {type: null,
                title: null,
                publication_title: "dummy",
                numberOfPages: 1,
                year: null,
                abstract: "dummy"}

        data.type = reference.entryType;
        data.title = reference.entryTags.title;
        var year = parseInt(reference.entryTags.year);
        data.year = year;

        if(reference.entryTags.pages != null){
            var pages = parseInt(reference.entryTags.pages);
            data.numberOfPages = pages;
        }
    return data;
}

module.exports.link = link;
