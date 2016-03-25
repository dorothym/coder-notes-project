// Route /api/tags

'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Notebook = mongoose.model('Notebook');
var Note = mongoose.model('Note');

// Get all tags for one user
// Error handling could be improved!

// move to method on User schema
router.get('/', function(req, res, next){
	var multidimensionalArrayOfNodeIds = [], 
		arrayOfNoteIds = [], 
		multidimensionalArrayOfTags = [], 
		arrayOfTags = [];

    multidimensionalArrayOfNodeIds = req.user.myNotebooks.map(function(element) { return element.notes })
    
    // now reduce that to a one-dimensional list
    arrayOfNoteIds = multidimensionalArrayOfNodeIds.reduce(function(a, b) {
         return a.concat(b);
        });

    // find notes with those IDs
	Note.find({
		_id: {
			$in: arrayOfNoteIds
		}
	})
	.then(function(notes) {
		// console.log("here are the notes:", notes)
		// get an array of array of tags
	    multidimensionalArrayOfTags = notes.map(function(element) { return element.tags })
	    
	    // now reduce that to a one-dimensional list
	    arrayOfTags = multidimensionalArrayOfTags.reduce(function(a, b) {
	         return a.concat(b);
	        });


	    // sort and filter for unique values
		arrayOfTags = arrayOfTags.sort().filter(function (e, i, arr) {
			return arr.lastIndexOf(e) === i;
		});

	    res.json(arrayOfTags);
	})
});

