'use strict';

angular.module('person')

.directive('networkgraph', function($rootScope) {
	return {
		restrict: 'E',
		template :'<div id="cy"></div>',
		replace: true,
		scope: {
			network: '=network',
            // controller function to be triggered when clicking on a node
            onElementClick:'&'
        },
        link: function(scope, element, attrs, fn) {
        	scope.typeColors = {
        		'ellipse':'#E03616',
        		'triangle':'#395E66',
        		'rectangle':'#7C5EAA',
        		'roundrectangle':'#772244',
        		'pentagon':'#990088',
        		'hexagon':'#229988',
        		'heptagon':'#118844',
        		'octagon':'#335577',
        		'star':'#113355'
        	};

        	/**
        	 * Executes the cytoscape function using the network defined in the directive to make a graph
        	 * @return {void} Doesn't return anything
        	 */
        	 scope.makeGraph = function() {
        	 	scope.network.forEach(function(element) {
        	 		if(element.group === 'nodes') {
        	 			var type = element.data.id.substring(0,3);
        	 			switch(type) {
        	 				case 'pub':
        	 				element.data.shape = 'ellipse';
        	 				break;
        	 				case 'per':
        	 				element.data.shape = 'triangle';
        	 				break;
        	 				case 'aff':
        	 				element.data.shape = 'rectangle';
        	 			}
        	 			element.data.shapeColor = scope.typeColors[element.data.shape];
        	 		}

        	 	});
        	 	var cy = cytoscape({
        	 		container: $('#cy')[0],
        	 		style: cytoscape.stylesheet()
        	 		.selector('node')
        	 		.css({
        	 			'content': 'data(title)',
        	 			'shape': 'data(shape)',
        	 			'background-color': 'data(shapeColor)',
        	 			'height': 80,
        	 			'width': 200,
        	 			'text-valign': 'center',
        	 			'color': 'white',
        	 			'text-outline-width': 2,
        	 			'text-outline-color': '#888'
        	 		})
        	 		.selector('edge')
        	 		.css({
        	 			'width': '10',
        	 			'line-color': '#B7D1DA',
        	 			'target-arrow-shape': 'triangle',
        	 			'target-arrow-color': '#B7D1DA',
        	 			'source-arrow-shape': 'triangle',
        	 			'source-arrow-color': '#B7D1DA'
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

        	 		elements: scope.network,

        	 		ready: function(){
        	 			window.cy = this;

        	 			cy.on('cxtdrag', 'node', function(e){
        	 				var node = this;
        	 				var dy = Math.abs( e.cyPosition.x - node.position().x );
        	 				var weight = Math.round( dy*2 );

        	 				node.data('weight', weight);

        	 			});
        	 			function generateTooltip(object) {
        	 				object = object._private.data;
        	 				var content = '';
        	 				var type = object.id.substring(0,3);
        	 				if(type === 'pub') {
        	 					content += '<h3><a href="/publications/' + object.id.slice(3) + '">' + object.title + '</a></h3>';
        	 					content += object.abstract;
        	 				} else if(type === 'per') {
        	 					content += '<h3><a href="/persons/' + object.id.slice(3) + '">' + object.title + '</a></h3>';
        	 					content += '<img src="' + (object.picture ? object.picture : '/assets/dummy.jpg')  + '" class="profile-image" />';
        	 				} else {
        	 					content += '<h3>' + object.title + '</h3>';
        	 				}
        	 				return content;
        	 			}
        	 			cy.nodes().qtip ({
        	 				content: function(){return generateTooltip(this);},
        	 				position: { my: 'top center',at: 'bottom center'},
        	 				style: {classes: 'qtip-bootstrap',tip: {width: 16,height: 8}}
        	 			});
        	 		}
        	 	});
			};
			$rootScope.$on('appChanged', function(){
				scope.makeGraph();
			});
		}
	};
});