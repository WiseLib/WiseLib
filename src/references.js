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
    var authorName = reference.entryTag.title;
    var result = DBManager.get({title: title}, publicationRepr, function(results){
        if(data.length < 1){
            var newId;
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
        if(data.length < 1){
            //TODO publication_with_unknown_person tabel vullen met nieuwe publication
            // eventueel bestaande users contacteren mbv een notification dat met person validation
        }
    });

    //TODO finish function
}
