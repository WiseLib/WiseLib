function link(req,res){
    console.log("linker" + req);
    var references = req.references;
    var resultId = [];
    //Alle references moeten afgegaan worden en gezocht worden in de database
    for(index = 0; index < references.length; index++){
        var reference = references[index];
        var pubId = searchDB(reference);
        resultId.push(pubId);
    }
    return resultId;
}

function searchDB(reference){
    var title =  reference.entryTag.title;
    var authorNames = getAuthorNames(reference);
    var authors = getAuthorNames(reference);
    var DbJson = bibToDb(reference);
    var result = DBManager.get({title: title}, publicationRepr, function(results){
        if(data.length < 1){
            var newId;
            //post publication with unknown person
            DBManager.post(DbJson, publicationRepr, function(id){
                newId = id;
            })

            //TODO publication_with_unknown_person tabel vullen met de nieuwe publication

             for(index = 0; index < authorNames.length(); index++){
                 var data = {publication_id: newId,
                             author_first_name: authorNames[index].firstName,
                             author_last_name: authorNames[index].lastName}
                  DBManager.post(data, unknownPersonPublicationRepr, function(id){})
               }

               return newId;

        }
        if(data.length = 1){
            return results.id;
        }
        //TODO what if more then 1 title comes up??
    });
}

function getAuthorNames(reference){
    var authors = reference.entryTag.author;
    var authorNames = authors.split('and');
    var data = {names: []};
    for(index = 0; index < authorNames.length; index++){
        var name = authorNames[index].split(',');
        if(name.length < 2){
            data.names.push({lastName: name[0], firstName: " "});
        } else {
            data.names.push({lastName: name[0], firstName: name[1]});
        }
    }
    return data;
}

function bibToDb(reference){
    var data = {publication_type: "null",
                title: "null",
                publication_title: " ",
                nr_of_pages: "0",
                published_in_year: "null",
                abstract: " "}

    try{
        data.publication_type = reference.entryType;
        data.title = reference.entryTag.title;
        data.published_in_year = reference.entryTag.year;
    }
    catch(ex){
        console.error("Crucial information missing: check if Type, Title and Year are filled in");
    }
    try{
        data.nr_of_pages = reference.entryTag.pages;
    }catch(ex){
        console.log("Pages: " + reference.entryTag.pages);
    }
    try{
        data.abstract = reference.entryTag.pages;
    }
    catch(ex){
        console.log("Abstract: " + reference.entryTag.abstract);
    }

    return data;
}

module.exports.link = link;
