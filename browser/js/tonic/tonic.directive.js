app.directive('tonicDirective', function() {
	return {
		restict: 'E', 
		scope: {
			code: '='
		}, 
		templateUrl: 'js/tonic/tonic.html',
		controller: 'tonicCtrl'
	}
})

app.factory('TonicFactory', function() {
	var TonicFactory = {};

	TonicFactory.getSelectionText = function() {
	    var text = "";
	    if (window.getSelection) {
	        text = window.getSelection().toString();
	    } else if (document.selection && document.selection.type != "Control") {
	        text = document.selection.createRange().text;
	    }
	    return text;
	}

	return TonicFactory;
})

app.controller('tonicCtrl', function($scope, TonicFactory) {
	$scope.run = false;
	$scope.tonicMsg = 'Run Tonic'

	$scope.runTonic = function() {
		if($scope.run)  {
			$scope.run = false;
			$scope.tonicMsg = 'Run in Tonic'
		}
		else {
			$scope.run = true;
			$scope.tonicMsg = 'Hide Tonic'
		}
		console.log('selectionText: ', TonicFactory.getSelectionText())
		document.getElementById("my-element").innerHTML = "";
		var notebook = Tonic.createNotebook({
		    element: document.getElementById("my-element"),
		    source: TonicFactory.getSelectionText()
		})

	}
})






