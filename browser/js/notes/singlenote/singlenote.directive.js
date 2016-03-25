app.directive('singlenote', function () {

    return {
        restrict: 'E',
        templateUrl: 'js/notes/singlenote/singlenote.html',
        controller: 'SingleNoteCtrl'
        // ,
        // scope: {
        // 	currentNote : '='
        // }

    };

});
