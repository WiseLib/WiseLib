'use strict';

angular.module('publication')

.factory('Publication', function($resource) {
	return $resource('/publications/:id.json', {id:'@id'}, {
		search: { method: 'GET', isArray: false, url:'/publications.json/?q=:q', params: {q:'@q'}},
		post:{ method: 'POST', url:'/publications.json'}
	});
})

.factory('WebSearchPublication',function($resource){
	return $resource('https://api.mendeley.com:port/search/catalog/?access_token=:token&:query',
		{token : '@token',
		query:'@query',
		port : ':443'});
})


.factory('GetApiToken',function($resource){
	return $resource('https://api.mendeley.com/oauth/token', {}, {
		get:{
			method:'POST',
			headers : {'Authorization' : 'Basic MTY1ODpVQ21EdTF1RFZxWVVQRGZV', 'Content-Type': 'application/x-www-form-urlencoded'}
			}
		});
});