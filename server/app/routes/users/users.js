// Route api/

'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');

//Create a new account/user
router.post('/', function(req, res, next) {
	mongoose.model('User').create(req.body)
	.then(function(newUser) {
		res.json(newUser)
	})
	.then(null, function(err) {
    console.log(err)
  })
})

//Get all users
router.get('/', function(req, res, next){
  mongoose.model('User').find()
  .then(function(allUsers){
    res.json(allUsers);
  })
  .then(null, next);
});

//Delete all users (for testing, to be removed)
router.delete('/', function(req, res, next){
  mongoose.model('User').remove({})
  .then(function(allUsers){
    res.json(allUsers);
  })
  .then(null, next);
});

