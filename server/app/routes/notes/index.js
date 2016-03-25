// Route /api/notes


'use strict';
var router = require('express').Router({mergeParams: true});
module.exports = router;
var mongoose = require('mongoose');
var Note = mongoose.model('Note');


// router.get('/', function(req, res, next){
// 		req.user.getNonTrashNotes(req.query)
// 		.then(function(notes) {
// 		    res.json(notes);
// 		})
// 		.then(null, next)
// });


router.get('/', function(req, res, next){
    req.user.getAllNotes(req.query)
    .then(function(notes) {
        res.json(notes);
    })
    .then(null, next)
});

router.param('noteId', function(req, res, next, id) {
  Note.findById(id)
  .then(function(note) {
    req.currentNote = note;
    next();
  })
  .then(null, next)
});

router.use('/:noteId', require('./note'));



