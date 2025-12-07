const nodemailer = require("nodemailer");

// ⚠️ CONFIGURA TU CORREO AQUÍ ⚠️
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jgartavia@gmail.com",
    pass: "foshmbrrlaqtkcem"
  }
});

module.exports = transporter;
