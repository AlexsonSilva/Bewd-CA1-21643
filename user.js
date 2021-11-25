//requesting mongoose and Schema for the class to be defined
const mongoose = require('mongoose')
const {Schema} = mongoose;

//setting up the rulse for our class using schema
const userSchema = new Schema({

    id: {type: Number, unique: true, required: true},
    name: String,
    age: Number,
    isLoggedIn: Boolean
    
})


//defining the name of the constructor for our class
const User = mongoose.model('User', userSchema);

//export the class, also called a model or a document, to use in different files
module.exports = User
