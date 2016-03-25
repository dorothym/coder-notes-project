// Route: /api/notes/:noteId/tags

'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');

// Get all tags of one note

router.get('/', function(req,res, next) {
	res.json(req.currentNote.tags);
});

// Add a new tag to the note
router.post('/', function(req, res, next) {
	req.currentNote.addTag(req.body.tag)
	.then(function(note) {
		res.json(note);	
	})
	.then(null, next)
})
// 
// Remove a tag from the note
router.put('/', function(req, res, next) {
	req.currentNote.removeTag(req.body.tag)
	.then(function(note) {
		res.json(note)		
	})
	.then(null, next)
})