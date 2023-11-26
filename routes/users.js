const express = require("express");
const users = express.Router();

const UserModel = require("../models/user");

// Import Bcrypt
const bcrypt = require('bcrypt')

// GET tutti gli utenti
users.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).send({
      statusCode: 200,
      users,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno del server",
    });
  }
});

// POST nuovo utente
users.post("/users/create", async (req, res) => {

  // determina la complessità della pwd criptata (algoritmo)
  const salt = await bcrypt.genSalt(10)
  // determina password criptata
  const hashedPwd = await bcrypt.hash(req.body.password, salt)

  const newUser = new UserModel({
    nomeUtente: req.body.nomeUtente,
    email: req.body.email,
// la password ora avrà la password criptata
    password: hashedPwd,
  });

  try {
    const user = await newUser.save();
    res.status(201).send({
      statusCode: 201,
      message: "Utente Creato!",
      payload: user,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno del server",
    });
  }
});

// PATCH
users.patch("/users/update/:id", async (req, res) => {
  const { id } = req.params; // _id di MongoDB

  const userExist = await UserModel.findById(id);

  if (!userExist) {
    return res.status(404).send({
      statusCode: 404,
      message: "Utente non trovato",
    });
  }
  try {
    const userUpdate = req.body;
    const options = { new: true };
    const result = await UserModel.findByIdAndUpdate(id, userUpdate, options);

    res.status(200).send({
      statusCode: 200,
      message: "Utente modificato!",
      result,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno del server",
    });
  }
});

// DELETE
users.delete("/users/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).send({
        statusCode: 404,
        message: "Utente non trovato o già eliminato",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Utente cancellato!",
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno del server",
    });
  }
});

module.exports = users;
