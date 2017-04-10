var app = angular.module('homecook', []);
app.controller('mainController', ['$scope', '$http', function($scope, $http){
	var pic_url = ["home1.jpg" , "home2.jpg"];
	var current = 0;

	$scope.aesthetic = {
		food_background : ""
	}


	/*$interval(function(){
		current = (current + 1) % length(pic_url) ;
		$scope.aesthetic.food_background = pic_url[current];
	}, 5000);*/

	

}]);
app.directive('customHeader', function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'js/directives/header.html',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
	};
});