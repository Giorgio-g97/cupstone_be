// import express
const express = require("express");
// import Mongoose
const mongoose = require("mongoose");
// import Enviroment Variables
require('dotenv').config();
// Import CORS
const cors = require('cors')
// Import path, libreria di NodeJS
const path = require('path')

// Import Route 
const companiesRoute = require('./routes/companies')
const usersRoute = require('./routes/users')
const MailRoute = require('./routes/SendEmail')
const LoginRoute = require('./routes/login')
// const githubRoute = require('./routes/github')

// Per utilizzare i metodi avanzati di Express creiamo la costante app
const app = express();

// Stabiliamo una connessione al server MongoDB
mongoose.connect(process.env.MONGODB_URL_SERVER);

// Connessione MongoDB
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Errore durante la connessione al DB'))

db.once('open', () => {
    console.log('Database connesso con successo')
})

// Middleware
app.use(express.json())
app.use(cors())
// Stabiliamo che questa directory sarà accessibile pubblicamente
app.use('/public', express.static(path.join(__dirname, 'public')))

// Utilizzo Route 
app.use('/', companiesRoute)
app.use('/', usersRoute)
app.use('/', MailRoute)
app.use('/', LoginRoute)
// app.use('/', githubRoute)

// ascolta il server alla porta indicata
app.listen(process.env.PORT, () => {
    console.log('Il server è connesso alla porta: ', process.env.PORT);
})