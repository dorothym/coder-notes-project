// /api/notebooks/:notebookId/trash

'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');

// Add to Trash
// ? Not sure what this route should return
router.put('/add', function(req, res, next) {
	req.currentNotebook.addToTrash()
		.then(function(notebook) {
			res.json(notebook)
		})
		.then(null, next)
})

// Remove from Trash
// ? Not sure what this route should return
router.put('/remove', function(req, res, next) {
	req.currentNotebook.removeFromTrash()
		.then(function(notebook) {
			res.json(notebook)
		})
		.then(null, next)
})
