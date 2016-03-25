app.controller('NavbarCtrl', function($scope, NotesFactory,notesService,AuthService,$rootScope) {


     $scope.setCurrentNote = NotesFactory.setCurrentNote;

     $scope.getnotes = function(){
        $scope.notes = NotesFactory.fetchMyNotes();
     }

     $scope.newNote = function(notebook) {
        // NotesFactory.getCachedNotebooks();

        NotesFactory.newNote(notebook._id)
        .then(function(newNote){
            NotesFactory.setCurrentNote(newNote);
            NotesFactory.setCurrentNotebook(notebook);

        })
        .then(null, function(err){
          console.error("Error saving new note!", err);
       });

    }

    $scope.newNotebook = function(notebookTitle) {
        return AuthService.getLoggedInUser()
        .then(function(user) {
          return NotesFactory.newNotebook(notebookTitle);
        }, function(err) {
            console.error("Error retrieving user!", err)
        })
        .then(function(newNotebook) {
            console.log('here is the new notebook?', newNotebook)
            // $rootScope.currentNote = newNotebook;
        })
    }

    $scope.getNotebooks = function() {
       NotesFactory.fetchMyNotebooks()
       .then(function(_notebooks){
            $scope.notebooks = _notebooks;
       })
       .then(null, function(err){
          console.error("Error retrieving notebooks!", err);
       });
    }
 });
app.filter('trunc', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || '...');
    };
});


