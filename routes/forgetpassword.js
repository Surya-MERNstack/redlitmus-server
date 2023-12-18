var express = require("express");
var router = express.Router();
const { CheckUser } = require("../Controller/loginController");
const { ForgetPassword , NewPassword} = require("../Controller/forgetpasswordController");

router.post("/", async (req, res) => {
  try {
    const { email } = await req.body;
    var checkCredentials = await CheckUser(email);
    if (checkCredentials === false) {
      res.status(500).send(false);
    } else if (checkCredentials === true) {
      const response = await ForgetPassword(email);
      if (response === true) {
        res.status(200).send(response);
      } else if (response === "Server busy") {
        res.status(200).send(response);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("error");
  }
});

router.post("/new", async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = await req.body;
    if (newPassword === confirmPassword) {
      var checkCredentials = await CheckUser(email);
      if (checkCredentials === false) {
        res.status(200).send(false);
      } else if (checkCredentials === true) {
        const response = await NewPassword(email,otp,newPassword);
        if (response === true) {
          res.status(200).send(response);
        } else if (response === "Server busy") {
          res.status(200).send(response);
        }
      }
    }
    else{
      res.status(200).send(false);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("error");
  }
});

module.exports = router;
