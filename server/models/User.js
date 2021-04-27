const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    chatId: {
        type: Number,
        unique: true,
        required: true
    },
    maxReminder: {
        type: Number
    },
    minReminder: {
        type: Number
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;