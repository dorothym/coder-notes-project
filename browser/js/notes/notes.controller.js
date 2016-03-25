app.controller('NotesCtrl', function($scope, AuthService, myNotebooks, NotesFactory, $rootScope, myTags, mySharedNotebooks, myNotes,notesService, currentNote) {

	$scope.user = null;

    $scope.currentNote = currentNote;

    // promises
    $scope.notes = myNotes;
    $scope.tags = myTags;
    $scope.sharednotebooks = mySharedNotebooks;
    $scope.notebooks = myNotebooks;

    // set the 'current note' to item 0 in the array by default. 
    // not sure if this logic is correct.
    // $rootScope.currentNote = $scope.notes[0];
    // $rootScope.currentNotebook = $scope.notebooks[0];
    //console.log("this is myNote,", myNotes );
    //console.log("this is", notesService);
    notesService.addAllnotes(myNotes);

	$scope.isLoggedIn = function () {
		return AuthService.isAuthenticated();
	};

    var setUser = function () {
        AuthService.getLoggedInUser().then(function (user) {
            $scope.user = user;
        });
    };

    setUser();

});

