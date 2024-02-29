const mongoose = require('mongoose');
/**
 * 
 */
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true // Ensure username is unique
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email is unique
        lowercase: true // Convert email to lowercase
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // Minimum password length
    },
    avatar: {
        type: String,
        default : "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"
    },
    
},{timestamps : true});

module.exports = mongoose.model('users', userSchema);