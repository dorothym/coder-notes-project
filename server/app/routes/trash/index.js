// Route: /api/trash

'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var _ = require('lodash');

// Get notes in the trash
router.get('/notes', function(req, res, next){
		req.user.getNotesInTrash(req.query)
		.then(function(notes) {
		    res.json(notes);
		})
		.then(null, next)
});


// Get notes and notebooks in the trash
router.get('/notebooks', function(req, res, next){
	// ? is _.filter async?
	res.json(_.filter(req.user.myNotebooks, {trash: true}))
	// req.user.getNotebooksInTrash()
	// .then(function(notebooks) {
	// 	res.json(notebooks);
	// })
	// .then(null, next)

});

// Get both notes and notebooks in the trash
router.get('/', function(req, res, next) {
	req.user.getTrash()
	.then(function(result) {
		res.json(result)
	})
	.then(null, next)
})

// Get both notes and notebooks in the trash
router.delete('/', function(req, res, next) {
	req.user.clearTrash()
	.then(function(result) {
		res.json('Successfully deleted trash')
	})
	.then(null, next)
})