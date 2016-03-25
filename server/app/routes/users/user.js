// Route api/users/:userId

'use strict';
var router = require('express').Router({mergeParams: true});
module.exports = router;
var mongoose = require('mongoose');
var User = mongoose.model('User');

// Get my account
router.get('/', function(req, res, next){
  res.json(req.user)
});

// Update my account
router.put('/', function(req, res, next){
	req.user.set(req.body).save()	
  .then(function(user){
    res.json(user);
  })
	.then(null, next)
});

// Delete my account
router.delete('/', function(req, res, next){
  req.user.remove()
  .then(function(deletedUser){
    res.json(deletedUser);
  })
  .then(null, next);
});

