//creates a new module (second parameter), should happen only once
var module = angular.module('wiselib');

module.factory('selector', function() {
	var class;
	var selection = [];

	var add = function(toAdd) {
		//first time adding an object
		if(typeof class === 'undefined') {
			class = toAdd.constructor;
		}
		//only allow object of the same type to be selected
		if(class == toAdd.constructor) {
			selection.push(toAdd);
		}
	}

	var remove = function(toRemove) {
		var i = selection.indexOf(toRemove);
        if(i > -1) {
           	this.authors.splice(i, 1);
        }
    }

    return {
    	selection: selection,
    	add: add,
    	remove: remove,
    };

});