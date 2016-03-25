// Route: /api/notebooks/:notebookId

'use strict';
var router = require('express').Router({mergeParams: true});
module.exports = router;
var mongoose = require('mongoose');
var Notebook = mongoose.model('Notebook')

//Get one notebook
router.get('/', function(req, res){
	res.json(req.currentNotebook)
})

// api/notebooks/trash


//Update a notebook
router.put('/', function(req, res, next){
	req.currentNotebook.set(req.body).save()
	.then(function(updatedNotebook) {
		res.json(updatedNotebook)
	})
	.then(null, next)
})

//Delete a notebook
router.delete('/', function(req, res, next){
	req.currentNotebook.remove()
	.then(function(response) {
		res.json(response)
	})
	.then(null, next)
})

router.post('/share', function(req, res, next) {
	req.currentNotebook.share(req.body.email)
	.then(function(sharedNotebook) {
		res.json(sharedNotebook)
	})
})

router.delete('/share', function(req, res, next) {
	req.currentNotebook.removeShare(req.body.email)
	.then(function(sharedNotebook) {
		res.json(sharedNotebook)
	})
})

router.use('/notes', require('./notebook.notes.js'));
router.use('/trash', require('./notebook.trash.js'));


