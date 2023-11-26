const mongoose = require('mongoose')

const UsersSchema = new mongoose.Schema({
    nomeUtente: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('UserModel', UsersSchema, 'users')