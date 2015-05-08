'use strict';
var module = angular.module('person');

module.factory('peopleGraph', [ '$q', function( $q ){
  var cy;
  var peopleGraph = function(eles){
    var deferred = $q.defer();
    console.log(eles);

    $(function(){ // on dom ready

      cy = cytoscape({
        container: $('#cy')[0],

        style: cytoscape.stylesheet()
          .selector('node')
            .css({
              'content': 'data(title)',
              'height': 80,
              'width': 200,
              // 'width': 'mapData(weight, 1, 200, 1, 200)',
               'text-valign': 'center',
                'color': 'white',
                'text-outline-width': 2,
                'text-outline-color': '#888'
             })
          .selector('edge')
                        .css({
                            'width': '10',
                            'target-arrow-shape': 'triangle',
                            'source-arrow-shape': 'triangle'
                        })
          .selector(':selected')
            .css({
              'background-color': 'black',
              'line-color': 'black',
              'target-arrow-color': 'black',
              'source-arrow-color': 'black',
              'text-outline-color': 'black'
          }),

        layout: {
          name: 'cose',
          padding: 10
        },

        elements: eles,

        ready: function(){
          deferred.resolve( this );

          cy.on('cxtdrag', 'node', function(e){
            var node = this;
            var dy = Math.abs( e.cyPosition.x - node.position().x );
            var weight = Math.round( dy*2 );

            node.data('weight', weight);

          });
        }
      });

    }); // on dom ready

    return deferred.promise;
  };

  return peopleGraph;


} ]);

module.controller('networkController', function($scope, $routeParams, $translate, Page, Person, TokenService, peopleGraph) {
	$translate('NETWORK').then(function(translated) {
		Page.setTitle(translated);
	});

	var user;
	var cy;
	try {
        user = TokenService.getUser();
    } catch(error) {
        $translate('LOGGED_IN_VIEW_REQUIREMENT').then(function(translated) {
            $scope.error = translated;
        });
        $scope.showLoading = false;
        return;
    }
	Person.network({id: user.person}, function(data) {

  // you would probably want some ui to prevent use of PeopleCtrl until cy is loaded
  peopleGraph( data.network ).then(function( peopleCy ){
    cy = peopleCy;

    // use this variable to hide ui until cy loaded if you want
    $scope.cyLoaded = true;
  });


    });
});