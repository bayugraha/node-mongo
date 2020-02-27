const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        min:6,
        max: 255
    },
    email: {
        type: String,
        require: true,
        min: 12,
        max: 255
    },
    password: {
        type: String,
        require: true,
        min: 8,
        max: 1024
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Users', UserSchema);