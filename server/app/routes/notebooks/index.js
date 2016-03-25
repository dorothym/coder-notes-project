// Route: /api/notebooks

'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Notebook = mongoose.model('Notebook');
var Note = mongoose.model('Note');

// Create a notebook
router.post('/', function(req, res, next) {
	req.user.createNotebook(req.body)
	.then(function(notebook) {
		res.json(notebook)
	})
	.then(null, next)
})

// // Get all own and shared notebooks of a user
// router.get('/all', function(req, res, next) {
// 	res.json(req.user.myNotebooks.concat(req.user.sharedWithMeNotebooks))
// })

//Get all own notebooks of a user
router.get('/', function(req, res, next) {
	req.user
	.deepPopulate('myNotebooks.notes')
	.then(function(user) {
		res.json(user.myNotebooks)
	})
	.then(null, next)
})


// Get shared notebooks:
router.get('/shared', function(req, res, next) {
	req.user
	.deepPopulate('sharedWithMeNotebooks.notes')
	.then(function(user) {
		res.json(user.sharedWithMeNotebooks)
	})
	.then(null, next)
})

router.param('notebookId', function(req, res, next, id) {
  Notebook.findById(id)
  .populate('notes')
  .then(function(notebook) {
    req.currentNotebook = notebook;
    next();
  })
  .then(null, next)
})


router.use('/:notebookId', require('./notebook.js'));

