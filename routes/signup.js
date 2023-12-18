const express = require("express");
var router = express.Router();
const { CheckUser } = require("../Controller/loginController");
const {
  InsertSignUpUser,
  InsertVerifyUser,
} = require("../Controller/signupController");

router.get("/:token", async (req, res) => {
  try {
    const response = await InsertSignUpUser(req.params.token);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    res.status(400).send(`<html>
    <head>
      <title>Registration Failed</title>
    </head>
    <body>
      <h1>Registration Failed</h1>
      <p>Link Expired...</p>
    </body>
  </html>`);
  }
});

router.post("/verify", async (req, res) => {
  console.log("/verify");
  try {
    const {
      nameSignup,
      emailIdSignup,
      phoneSignup,
      passwordSignup,
      confirmpasswordSignup,
    } = await req.body;
    var registerCredentials = await CheckUser(emailIdSignup);
    if (registerCredentials === false) {
      await InsertVerifyUser(
        nameSignup,
        emailIdSignup,
        passwordSignup,
        phoneSignup
      );
      res.status(200).send(true);
    } else if (registerCredentials === true) {
      res.status(200).send(false);
    }
  } catch (error) {
    console.log("catch");
    console.log(error);
    res.status(400).send("error");
  }
});

module.exports = router;
