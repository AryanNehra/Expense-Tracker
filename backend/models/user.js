const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    profilePhoto: {
        type: String,
        default: '',
    }
}, {
    timestamps: true 

});

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;