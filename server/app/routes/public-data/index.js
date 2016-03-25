// Route: api/public
'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Note = mongoose.model('Note');
var Notebook = mongoose.model('Notebook');

// Find all Notebooks (admin)
router.get('/notebooks/all', function(req, res, next) {
	Notebook.find()
	.then(function(notebooks) {
		res.json(notebooks)
	})
	.then(null, next)
})

// Remove all Notebooks (admin)
router.delete('/notebooks/all', function(req, res, next) {
	Notebook.remove({})
	.then(function(notebooks) {
		res.json(notebooks)
	})
	.then(null, next)
})

// Find all Notes
router.get('/notes/all', function(req, res, next) {
	Note.find()
	.then(function(notes) {
		res.json(notes)
	})
	.then(null, next)
})

// Remove all Notes (admin)
router.delete('/notes/all', function(req, res, next) {
	Note.remove({})
	.then(function(notes) {
		res.json(notes)
	})
	.then(null, next)
})

// Find all Public Notebooks
router.get('/notebooks', function(req, res, next) {
	Notebook.find({type: 'public'})
	.then(function(notebooks) {
		res.json(notebooks)
	})
	.then(null, next)
})

// Find all Public Notes
router.get('/notes', function(req, res, next) {
	Note.find({type: 'public'})
	.then(function(notes) {
		res.json(notes)
	})
	.then(null, next)
})

