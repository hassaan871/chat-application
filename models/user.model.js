const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    is_online: {
        type: String,
        default: '0'
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;