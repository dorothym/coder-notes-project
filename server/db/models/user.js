'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var _ = require('lodash');
var Promise = require('bluebird');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String
    },
    myNotebooks: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Notebook'
    }],
    sharedWithMeNotebooks:  [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Notebook'
    }],
    salt: {
        type: String
    },
    google: {
        id: String
    }, 
    github: {
        id: String
    }
});

userSchema.plugin(deepPopulate);

userSchema.virtual('allNotebooks').get(function() {
    return this.myNotebooks.concat(this.sharedWithMeNotebooks)
});


userSchema.pre('save', function(next) {
    var thisUser = this; 
    if (this.myNotebooks.length === 0) {
        mongoose.model('Notebook').create({title: 'My First Notebook'})
        .then(function(notebook) {
            thisUser.myNotebooks.push(notebook._id)
            return thisUser.save();
        })
        .then(function() { next() }, next);
    }
    else next();
})

userSchema.post('remove', function(doc) {
    Promise.map(doc.myNotebooks, function(notebook) {
        return notebook.remove()
    })       
})

// userSchema.methods.getAllNotes = function() {
//     var multidimensionalArrayOfNodeIds = [], 
//         arrayOfNoteIds = [], 
//         multidimensionalArrayOfTags = [], 
//         arrayOfTags = [];

//     multidimensionalArrayOfNodeIds = this.myNotebooks.map(function(element) { 
//         return element.notes 
//     })

//     arrayOfNoteIds = multidimensionalArrayOfNodeIds.reduce(function(a, b) {
//          return a.concat(b);
//         });

//    return mongoose.model('Note').find({
//         _id: {
//             $in: arrayOfNoteIds
//         }
//     })
// }

userSchema.methods.getAllNotes = function(tags) {
    var multidimensionalArrayOfNodeIds = [], 
        arrayOfNoteIds = [], 
        multidimensionalArrayOfTags = [], 

    multidimensionalArrayOfNodeIds = this.myNotebooks.map(function(element) { 
        return element.notes 
    })

    arrayOfNoteIds = multidimensionalArrayOfNodeIds.reduce(function(a, b) {
         return a.concat(b);
        });

    var tagsArr = [];
    for(var tag in tags) {
        tagsArr.push(tags[tag]);
    }

    if(!tagsArr.length) {
       return mongoose.model('Note').find({
            _id: {
                $in: arrayOfNoteIds
            }, 
        })       
    } else {

        return mongoose.model('Note').find({
            _id: {
                $in: arrayOfNoteIds
            }, 
            tags: {
                $all: tagsArr
            }
        })       
    }
}

userSchema.methods.getNonTrashNotes = function(tags) {
    return this.getAllNotes(tags)
    .then(function(notes) {
        return _.filter(notes, {trash: false})
    })
}

userSchema.methods.getNotesInTrash = function(tags) {
    return this.getAllNotes(tags)
    .then(function(notes) {
        return _.filter(notes, {trash: true})
    })
}

userSchema.methods.getNotebooksInTrash = function() {
    return _.filter(this.myNotebooks, {trash: true})
}

userSchema.methods.getTrash = function () {
    var notes, notebooks;
    var self = this;
    return self.getNotesInTrash()
    .then(function(trashnotes) {
        notes = trashnotes
        return notes;
    })
    .then(function(notes) {
        notebooks = self.getNotebooksInTrash()
        return notebooks
    })
    .then(function(notebooks) {
        return notebooks.concat(notes)
    })
}

userSchema.methods.clearTrash = function() {
    return this.getTrash()
    .then(function(result) {
        return Promise.map(result, function(item) {
            return item.remove()
        })
    })
}


//bind didn't work,so I just passed values with variables here
userSchema.methods.createNotebook = function(body) {
   var thisUser = this;
   var notebook;
   return mongoose.model('Notebook').create(body)
   .then(function(_notebook) {
        notebook = _notebook
        thisUser.myNotebooks.push(notebook._id);
        return thisUser.save();       
   })
   .then(function(){
        console.log("this is notebook,",notebook );
        return notebook;
   })
}

// method to remove sensitive information from user objects before sending them out
userSchema.methods.sanitize =  function () {
    return _.omit(this.toJSON(), ['password', 'salt']);
};

// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
};

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.salt = this.constructor.generateSalt();
        this.password = this.constructor.encryptPassword(this.password, this.salt);
    }
    next();

});


userSchema.statics.generateSalt = generateSalt;
userSchema.statics.encryptPassword = encryptPassword;

userSchema.method('correctPassword', function (candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});


mongoose.model('User', userSchema);
