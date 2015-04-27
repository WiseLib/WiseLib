'use strict';
angular.module('toast', [])

.controller('ToastCtrl', function($scope, $mdToast, text, error) {
    $scope.content = text;
    $scope.textColor = error ? 'FF0000' : '00FF00';
    $scope.buttonClass = error ? 'md-warn' : 'md-success';
    $scope.closeToast = function() {
        $mdToast.hide();
    };
})

.factory('ToastService', function($mdToast) {
	return {
		showToast: function(text, error) {
			$mdToast.show({
                        controller: 'ToastCtrl',
                        templateUrl: '../views/feedback-toast.html',
                        hideDelay: 6000,
                        position: 'top right',
                        locals: {text: text,
                            error: error}
                    });
		}
	};
});