const express = require("express");
const email = express.Router();
// Import nodemailer
const { createTransport } = require("nodemailer");

// Config Nodemailer con Ethereal Mail
const transporter = createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "toney0@ethereal.email",
    pass: "Frw81GV5q1z5XV191h",
  },
});

// Metodo POST invio mail
email.post("/send-email", async (req, res) => {
  const { subject, text } = req.body;

  const mailOptions = {
    from: "noreply@nodemailer.com",
    to: "toney0@ethereal.email",
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error(error)
        res.status(500).send('Errore invio mail')
    }else{
        console.log('Mail inviata')
        res.status(200).send('Mail inviata!')
    }
  });
});

module.exports = email;
