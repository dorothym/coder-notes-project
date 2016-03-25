// api/notes/:noteId

'use strict';
var router = require('express').Router({mergeParams: true});
module.exports = router;
var mongoose = require('mongoose');
var Note = mongoose.model('Note');

router.get('/', function(req,res, next) {
	res.json(req.currentNote);
});

// Update one Note
router.put('/', function(req, res, next) {
	console.log("updating one note")
	return req.currentNote.set(req.body).save()
	.then(function(updatedNote) {
		console.log("updated note", updatedNote)
		res.json(updatedNote)
	})
	.then(null, next)
})

router.use('/tags', require('./note.tags.js'));
router.use('/trash', require('./note.trash.js'));



