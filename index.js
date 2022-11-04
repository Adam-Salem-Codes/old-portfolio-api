const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
require("dotenv").config();

const port = 3001;

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    pass: process.env.WORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

transporter.verify((err, success) => {
  err
    ? console.log(err)
    : console.log(`=== Server is ready to take messages: ${success} ===`);
});
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept,X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});
app.set("Access-Control-Allow-Origin", "*");
app.post("/api", jsonParser, (req, res) => {
  const email = req.body.email;
  const message = req.body.message;
  const emailback = req.body.emailback;
  let mailOptions = {
    from: email,
    to: process.env.EMAIL,
    subject: `From ${email}. Wants an email back: ${emailback} (Website)`,
    text: message,
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
    }
  });
  console.log(message);
});
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
