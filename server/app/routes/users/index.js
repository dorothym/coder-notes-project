// Route api/
'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');

router.use('/users', require('./users.js'))
router.use('/myaccount', require('./user.js'));
router.use('/tags', require('./user.tags.js'));




