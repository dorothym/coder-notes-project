/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));
var Note = Promise.promisifyAll(mongoose.model('Note'));
var Notebook = Promise.promisifyAll(mongoose.model('Notebook'));

var Notes = require('./fakedata/notes.js')
var Notebooks = require('./fakedata/notebook.js')
var Users = require('./fakedata/users.js')

var seedNotes = function () {

    return Note.createAsync(Notes);

};

var seedNotebooks = function () {

    return Notebook.createAsync(Notebooks);

};
var seedUsers = function () {

    return User.createAsync(Users);

};


var notesDB,notebookDB,userDB;
connectToDb.then(function () {

    for (var i = 0 ; i < Notes.length; i++) {
        if (i % 3 === 0  && i > 0) Notes[i].type = 'public';
        if(i % 5 === 0 && i > 0) Notes[i].trash = true;
        console.log("Notes,", Notes[i]);
    }
    Note.findAsync({})
    .then(function (notes) {
        if (notes.length === 0) {
            return seedNotes();
        } else {
            console.log(chalk.magenta('Seems to already be note data, exiting!'));
            //process.kill(0);
        }
    })
    .then(function (notes) {
        for(i=0; i<Notebooks.length; i++){
            if(i % 3 === 0 && i > 0) Notebooks[i].type = 'public';
            Notebooks[i].notes=[notes[2*i]._id,notes[2*i+1]._id];
            console.log(" Notebooks.notes", Notebooks[i].notes);
        }
        return seedNotebooks();
       
        // console.log(chalk.green('Seed successful!'));
        // process.kill(0);
    })
    .then(function(notebooks){
        for (i=0; i<Users.length;i++){
            Users[i].myNotebooks = [notebooks[5*i]._id,notebooks[5*i+1]._id,notebooks[5*i+2]._id,notebooks[5*i+3]._id,notebooks[5*i+4]._id]
            
            if(notebooks[5*i+8]) {Users[i].sharedWithMeNotebooks = [notebooks[5*i+7]._id, notebooks[5*i+8]._id]}
            console.log("user mynotebooks",Users[i].myNotebooks)
            //console.log("user sharedWithMeNotebooks",Users[i].sharedWithMeNotebooks)
        }
       
        return seedUsers();
    })
    .then(function(){
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });
});
