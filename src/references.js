var DBManager = require('./dbmanager.js');
var linker = require('./linker.js');

function link(req,res){
    var references = req.references;
    var resultId = [];
    //Alle references moeten afgegaan worden en gezocht worden in de database
    for(index = 0; index < references.length; index++){
        var reference = references[index];
        var pubId = searchDB(reference);
        console.log('Index = ' + pubId);
        req.references[index] = pubId;
    }
    return req;
}

function searchDB(reference){
    var authors = getAuthorNames(reference);
    console.log(authors.names);
    var DbJson = bibToDb(reference);
    console.log(JSON.stringify(DbJson));
    var result = DBManager.get({title: DbJson.title}, linker.publicationRepr, function(id){
        console.log(results);

        if(results.length = 1){
            console.log("KNOWN PUBLICATION");
            return results.id;
        }
        //TODO what if more then 1 title comes up??
    })
    if(result == null){
        console.log("UNKNOWN PUBLICATION");
        var newId;
        //post publication with unknown person
        DBManager.post(DbJson, linker.publicationRepr, function(id){
            newId = id;
            console.log("ID: " + id);
        });

        //TODO publication_with_unknown_person tabel vullen met de nieuwe publication
        for(index = 0; authors.names[index].lastname != null; index++){
            var data = {publication_id: newId,
                author_first_name: authors.names[index].firstName,
                author_last_name: authors.names[index].lastName}
                DBManager.post(data, linker.unknownPersonPublicationRepr, function(id){
                    console.log("UNKNOWN PERSON ADDED")
                })
            }

            return newId;

        };
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
                numberOfPages: 1,
                year: null}

        data.type = reference.entryType;
        data.title = reference.entryTags.title;
        data.year = reference.entryTags.year;

        if(reference.entryTags.pages != null){
            data.numberOfPages = reference.entryTags.pages;
        }
    return data;
}

module.exports.link = link;
