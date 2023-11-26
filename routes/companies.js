// Import Express e Router
const express = require("express");
const companies = express.Router();
// Import crypto per gen. randomId
const crypto = require("crypto");
// Import multer per gestire uploads
const multer = require("multer");
// Import Cloudinary per caricare in cloud i files
const cloudinary = require("cloudinary").v2;
// Import CloudinaryStorage
const { CloudinaryStorage } = require("multer-storage-cloudinary");
// Import dotenv
require("dotenv").config();

// Import Middlewares
// const verifyToken = require('../middlewares/verifyToken')

// Import Modello per la creazione companies
const CompanyModel = require("../models/company");

// Configurazione Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Creazione CloudinaryStorage
const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    format: async (req, file) => "png",
    public_id: (req, file) => file.name,
  },
});

// const upload = multer({ storage: internalStorage });
const cloudUpload = multer({ storage: cloudStorage });

// Metodo POST per caricare file nel Cloudinary
companies.post(
  "/companies/cloudUpload",
  cloudUpload.single("cover"),
  async (req, res) => {
    try {
      res.status(200).json({ cover: req.file.path });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Errore interno del server",
      });
    }
  }
);

// Metodo GET tutte le aziende
companies.get("/companies",  async (req, res) => {
  try {
    const companies = await CompanyModel.find().populate(
      "consulente",
      "nomeUtente email"
    );
    res.status(200).send({
      statusCode: 200,
      companies,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno del server",
    });
  }
});

// Metodo GET per la ricerca di un'azienda specifica

// Metodo POST per la creazione di un'azienda
companies.post("/companies/create", async (req, res) => {
  const newCompany = new CompanyModel({
    nome: req.body.nome,
    codiceFiscale: req.body.codiceFiscale,
    pIva: Number(req.body.pIva),
    cover: req.body.cover,
    consulente: req.body.consulente,
  });

  try {
    const company = await newCompany.save();
    res.status(201).send({
      statusCode: 201,
      message: "Azienda inserita!",
      payload: company,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno del server",
    });
  }
});

// Metodo PATCH: modifica azienda
companies.patch("/companies/update/:id", async (req, res) => {
  const { id } = req.params; // _id di MongoDB

  const companyExist = await CompanyModel.findById(id);

  if (!companyExist) {
    return res.status(404).send({
      statusCode: 404,
      message: "Azienda non trovata",
    });
  }
  try {
    const companyUpdate = req.body;
    const options = { new: true }; // visualizza oggetto con modifiche già apportate
    const result = await CompanyModel.findByIdAndUpdate(
      id,
      companyUpdate,
      options
    );

    res.status(200).send({
      statusCode: 200,
      message: "Azienda modificata!",
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
companies.delete("/companies/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const company = await CompanyModel.findByIdAndDelete(id);

    if (!company) {
      return res.status(404).send({
        statusCode: 404,
        message: "Azienda non trovata o già eliminata",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Azienda cancellata!",
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno del server",
    });
  }
});

// Esporto la route delle aziende
module.exports = companies;
// Ora lo importo nel server.js
