const express = require('express')
const login = express.Router()
const bcrypt = require('bcrypt')
const UserModel = require('../models/user')
const jwt = require ('jsonwebtoken')
require('dotenv').config()

login.post('/login', async (req, res) => {
    const user = await UserModel.findOne({ email: req.body.email })

// Verifica Utente
    if(!user){
        return res.status(404).send({
            statusCode: 404,
            message: "Utente non trovato o errato"
        })
    }

//Verifica Password: compara la password inserita dall'utente con quella già registrata
    const validPwd = await bcrypt.compare(req.body.password, user.password)
    if(!validPwd){
        return res.status(400).send({
            statusCode: 400,
            message: "Credenziali errate!"
        })
    }
// Generazione Token
    const token = jwt.sign({
        id: user._id,
        firstName: user.nomeUtente,
        email: user.email
    }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    })

    res.header('Authorization', token).status(200).send({
        statusCode: 200,
        message: "Login effettuato con successo!",
        token
    })

})

module.exports = login