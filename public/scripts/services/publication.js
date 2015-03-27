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
	return $resource('https://api.mendeley.com:port/search/catalog/?access_token=:accessToken&:query',
		{accessToken : 'MSwxNDI3MzkxMjM5OTUxLDMwNjI3MTk3MSw3MTQsYWxsLCxKQzJmUVFDU3hBbElaQ0ZETkt2bUl6ZVZoRFk',
		query:'@query',
		port : ':443'});
});
