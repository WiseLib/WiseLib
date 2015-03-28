function link(req,res){
    var references = req.references;
    var resultId = [];
    //Alle references moeten afgegaan worden en gezocht worden in de database
    for(index = 0; index < references.length; index++){
        var reference = references[index];
        var result[index] = searchDB(reference);
    }
}

function searchDB(reference){
    var title =  reference.entryTag.title;
    var authorNames = getAuthorNames(reference);
    var result = DBManager.get({title: title}, publicationRepr, function(results){
        if(data.length < 1){
            var newId;
            var authors = getAuthorNames(reference);
            //post publication with unknown person
            DBManager.post(reference, publicationRepr, function(id){
                newId = id;
            })

            //TODO publication_with_unknown_person tabel vullen met de nieuwe publication
            /*
            * for(index = 0; index < reference.authors.length; index++){
            *       DBManager.post()
            *    }
            */
        }
        if(data.length = 1){
            return results.id;
        }
        //TODO what if more then 1 title comes up??
    });

    //TODO finish function
}

function getAuthorNames(reference){
    var authors = reference.entryTag.author;
    var authorNames = authors.split('and');
    var data = {names: []};
    for(index = 0; index < authorNames.length; index++){
        var name = authorNames[index].split(',');
        if(name.length < 2){
            data.names.push({lastName: name[0], firstName: ""});
        } else {
            data.names.push({lastName: name[0], firstName: name[1]});
        }
    }
    return data;
}
