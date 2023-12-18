var express = require("express");
var router = express.Router();
const { AuthorizeUser } = require("../Controller/loginController");
const { AddCart, ViewCart } = require("../Controller/cartController");
const { HomePage } = require("../Controller/homeController");

router.post("/", async (req, res) => {
  try {
    const auth_token = req.headers.authorization.split(' ')[1];
    const { updatedCartData } = await req.body;
    console.log()
    var loginCredentials = await AuthorizeUser(auth_token);
    if (loginCredentials === false) {
      res.status(200).send("login");
    } else {
      AddCart(loginCredentials.email, updatedCartData);
      res.status(200).send(null);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("login");
  }
});

router.get("/view", async (req, res) => {
  const auth_token = req.headers.authorization.split(' ')[1];
    var loginCredentials = await AuthorizeUser(auth_token);
  try {
    
    if (loginCredentials === false) {
      res.status(200).send("login");
    } else {
        var restaurantList = await HomePage();
        res.json(ViewCart(restaurantList, loginCredentials));
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("login");
  }
});

module.exports = router;
