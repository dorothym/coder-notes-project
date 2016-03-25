app.controller('SingleNoteCtrl', function($scope, NotesFactory) {
  	$scope.savenote = {};
	
  	$scope.openTW = false

  	var stroutput = "";
    $scope.currentNote = NotesFactory.getCurrentNote;

    $scope.showmarkdown = false;
    $scope.successmessage = null;

    $scope.removeTag = function(noteId, tag) {
      NotesFactory.removeTag(noteId, tag);
    }

    $scope.addTag = function(noteId, tag) {
      NotesFactory.addTag(noteId, tag);
      $scope.openTW = false;
    }

    $scope.openTagWindow = function() {
      $scope.openTW = true;
    }

     // $scope.save = NotesFactory.saveNote;


    $scope.save = function(){ 
      console.log("trying to save note...")
      var subjectToSave = $('#notesubject').html();
      // var bodyToSave = $('#notebody').html();
      // var bodyToSave = $('#notebody > textarea').val();
      var bodyToSave = $('#notebody').val();
      var privacyType = $("#privacy-type").prop('checked') ? "public" : "private";

      $scope.savenote = {
        "subject": subjectToSave,
        "body": bodyToSave,
        "type" : privacyType
      }

      console.log("current note is", $scope.currentNote())

      console.log("savenote is", $scope.savenote)
      $scope.currentNotebook = NotesFactory.getCurrentNotebook();
      console.log("current notebook is", $scope.currentNotebook);
      
      NotesFactory.saveNote($scope.currentNotebook._id, $scope.currentNote()._id, $scope.savenote)
      .then(function(note) {
          console.log("returned note is", note)
          $scope.successmessage="Note saved successfully!" + note;
        }, function(err) {
          $scope.errormessage = "Error saving note" + err;
      })
    }

  $scope.deleteNote = function(noteId) {
    console.log("inside deleteNote")
    NotesFactory.trashNote(noteId);
  }

  $scope.highlightPre = function() {
    hljs.initHighlighting();
  }

  $scope.addPre = function() {
    var domElement = $('#testdiv')[0];
    var codeValue = domElement.innerHTML;
    var preElement = $('<pre><code>' + codeValue + '</code></pre>');
    $(domElement).replaceWith(preElement);
    hljs.initHighlighting();

  }


})