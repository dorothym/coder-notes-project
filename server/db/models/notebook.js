'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var _ = require('lodash');
var Promise = require('bluebird');

var notebookSchema = new mongoose.Schema({
    type:  { 
        type: String,
        enum: ['private', 'public'],
        default: 'private'
    }, 
    title: {
        type: String,
        default: 'My Notebook', // + Date.now.toString()
        required: true
    }, 
    date: {
        type: Date, 
        default: Date.now
    },
    trash: {
        type: Boolean, 
        default: false
    },
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
    }]

});

// HOOKS
// Removing notebook from user.myNotebooks
notebookSchema.post('remove', function(doc, next) {
    return mongoose.model('User')
        .findOneAndUpdate(
            {myNotebooks: {$elemMatch: {$eq : doc._id}}},
             {$pull: {myNotebooks: doc._id}})
        .exec()
        .then(function() {
            next()
        })
})

// Removing notebook from user.sharedWithMeNotebooks - not tested!
notebookSchema.post('remove', function(doc, next) {
    return mongoose.model('User')
        .findOneAndUpdate(
            {sharedWithMeNotebooks: {$elemMatch: {$eq : doc._id}}},
             {$pull: {sharedWithMeNotebooks: doc._id}})
        .exec()
        .then(function() {
            next()
        })
})

notebookSchema.post('remove', function(doc, next) {
    doc.populate('notes')
    .then(function(notebook) {
        return Promise.map(doc.notes, function(note) {
            return note.remove()
        })       
    })
    .then(function() {
        next()
    })
})

// METHODS
notebookSchema.methods.getOwner = function() {
    return mongoose.model('User')
        .findOne({myNotebooks: {$elemMatch: {$eq : this._id} } }).exec();
}

notebookSchema.methods.createNote = function(body) {
    var notebook = this;
    var note;
    return mongoose.model('Note').create(body)
    .then(function(_note) {
        note = _note;
        notebook.notes.push(note._id)         
        return notebook.save();
    })
    .then(function(){
       return note;
    })
}

notebookSchema.methods.share = function(userEmail) {
    var thisNotebook = this;
    return mongoose.model('User').findOne({email: userEmail})
    .then(function (user) {
        user.sharedWithMeNotebooks.push(thisNotebook._id)
        return user.save();
    })
    .then(function() {
        return thisNotebook;
    })
}

notebookSchema.methods.removeShare = function(userEmail) {
    var thisNotebook = this;
    return mongoose.model('User').findOne({email: userEmail})
    .then(function (user) {
        user.sharedWithMeNotebooks.pull(thisNotebook._id)
        return user.save();
    })
    .then(function() {
        return thisNotebook;
    })
}

// ? Not sure what this method should return
notebookSchema.methods.addToTrash = function() {
    var thisNotebook = this;
    return this.set({trash: true}).save()
    .then(function(notebook) {
        return Promise.map(notebook.notes, function(note) {
            return note.addToTrash()
        })
    })
    .then(function(notes) {
        return thisNotebook;
    })
}

// This method returns notebook
notebookSchema.methods.removeFromTrash = function() {
    var thisNotebook = this;
    return this.set({trash: false}).save()
    .then(function(notebook) {
        return Promise.map(notebook.notes, function(note) {
            return note.removeFromTrash()
        })
    })
    .then(function(notes) {
        return thisNotebook;
    })
}

mongoose.model('Notebook', notebookSchema);









