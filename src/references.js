var DBManager = require('./dbmanager.js');
var linker = require('./linker.js');
var Promise = require('bluebird');

function link(req, next){
    var references = req.references;
    var resultId = [];
    //Alle references moeten afgegaan worden en gezocht worden in de database
    var promises = [];
    for(var r in references) {
        var p = searchDB(references[r]);
        var res = p.then(function(id) {
            resultId[r] = id;
            console.log(resultId);
        })
        .catch(function(reference) {
            //rejected promise
            console.log("REJECTION");
            /*postUnknownPublication(reference, function(id){
                console.log("ID: " + id);
            });*/
        });
        promises.push(res);
    }
    Promise.all(promises).then(function () {
        //all promises were executed
        console.log(resultId);
        return resultId;
    });

}

function searchDB(reference){
    var promise = new Promise(function(resolve, reject){
        var DbJson = bibToDb(reference);
        console.log(JSON.stringify(DbJson));
        console.log("SEARCH DB");
        DBManager.get({title: DbJson.title}, linker.publicationRepr, function(results){
            console.log("RESULT GET: " + JSON.stringify(results));
            if(results.length === 1){
                console.log("KNOWN PUBLICATION");
                resolve(results[0].id);
            } else {
                console.log("UNKNOWN PUBLICATION")
                var p = postUnknownPublication(reference);
                var res = p.then(function(id) {
                    console.log("ID: "+id);
                    resolve(id);
                })
                .catch(function(reference) {
                    //rejected promise
                    reject();
                });
            };
        });
    });
    return promise;
}

function postUnknownPublication(reference){
    //post publication with unknown person
    var promise = new Promise(function(resolve, reject){
        var authors = getAuthorNames(reference);
        var DbJson = bibToDb(reference);
        //DbJson.unknownAuthors = authors.names;

        console.log("POST UNKNOWN PUBLICATION: " + JSON.stringify(DbJson));
        DBManager.post(DbJson, linker.publicationRepr, function(id){
            console.log("ID: " + id);
            if(id != null){
                console.log("UNKNOWN RESOLVED");
                resolve(id);
            } else {
                console.log("ERROR");
                reject();
            }
        });
    });
    return promise;
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
    var data = {publication_type: null,
                title: null,
                publication_title: "dummy2",
                nr_of_pages: 1,
                published_in_year: null,
                abstract: "dummy2"}

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
