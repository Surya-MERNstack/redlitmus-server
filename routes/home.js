const express = require("express");
var router = express.Router();
const { AuthorizeUser } = require("../Controller/loginController");
const { HomePage } = require("../Controller/homeController");
const { CheckCart } = require("../Controller/cartController");

router.get("/", async function (req, res) {

  try {
    const auth_token = req.headers.authorization.split(' ')[1];
    var loginCredentials = await AuthorizeUser(auth_token);
    if (loginCredentials === false) {
      res.status(200).send("login");
    } else {
      var restaurantList = await HomePage();
      res.json(CheckCart(restaurantList, loginCredentials));
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("login");
  }
});

module.exports = router;
