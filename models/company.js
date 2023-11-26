// Importo Mongoose
const mongoose = require("mongoose");

const CompaniesSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    codiceFiscale: {
      type: String,
      required: true,
    },
    pIva: {
      type: Number,
      required: true,
    },
    cover: {
      type: String,
    },
    consulente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: false,
    },
  },
  { timestamps: true, strict: true }
);

// Esporto lo schema
module.exports = mongoose.model("CompanyModel", CompaniesSchema, "companies");
