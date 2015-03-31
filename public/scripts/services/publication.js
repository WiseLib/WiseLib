'use strict';

angular.module('publication', [])

.factory('Publication', function($resource) {
	return $resource('/persons/:id/publications.json', {id:'@id'}, {
		query: { method: 'GET', isArray: false }
	});
})

.factory('SearchPublication', function($resource) {
	return $resource('/publications.json/?q=:q',{q:'@q'});
})

.factory('WebSearchPublication',function($resource){
	return $resource('https://api.mendeley.com:port/search/catalog/?access_token=:token&:query',
		{token : '@token',
		query:'@query',
		port : ':443'});
})


.factory('GetApiToken',function($resource){
	return $resource('https://api.mendeley.com/oauth/token',{},{
		get:{
			method:'POST',
			headers : {'Authorization' : 'Basic MTY1ODpVQ21EdTF1RFZxWVVQRGZV','Content-Type': 'application/x-www-form-urlencoded'}
			}
		})
});