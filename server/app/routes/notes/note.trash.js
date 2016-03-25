// /api/notes/:noteId/trash

'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');

// Add to Trash
router.put('/add', function(req, res) {
	req.currentNote.addToTrash()
		.then(function(note) {
			res.json(note)		
		})
})

// Remove from Trash
router.put('/remove', function(req, res) {
	req.currentNote.removeFromTrash()
		.then(function(note) {
			res.json(note)		
		})
})
