app.controller('SidenavCtrl', function($scope, $rootScope, NotesFactory) {

	$scope.getCachedNotebooks = NotesFactory.getCachedNotebooks;

	// change the current note displayed in singlenote.html to the note that the user clicked in sidenav
	// $scope.switchCurrentNote = function(note,notebook) {
 //        $rootScope.currentNotebook = notebook;
 //        console.log("current notebook", $rootScope.currentNotebook)
		
	// 	NotesFactory.getNote(note._id)
	// 	.then(function(theNote) {
	// 		console.log("setting current note to", theNote)
	// 		$rootScope.currentNote = theNote;
	// 	})
	// 	}
	$scope.setCurrentNotebook = function(notebook){
		NotesFactory.setCurrentNotebook(notebook);
	}

	$scope.setCurrentNote = function(note, notebook){
		// console.log("\nsidenav controller. setting current note BEFORE", note);
		NotesFactory.setCurrentNote(note);
		// console.log("\nsidenav controller. setting current note AFTER", note);
		if (notebook){
			// console.log("this is current note", note);
			NotesFactory.setCurrentNotebook(notebook);
		}
	}

	$scope.filters = {};
	$scope.items = ['notebook', 'note']


})


app.filter('filterByTag', function (tag, notes) { 
        return notes.tags.indexOf(tag) !== -1
    });