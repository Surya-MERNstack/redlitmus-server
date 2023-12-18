var express = require("express");
var router = express.Router();
const { AuthorizeUser } = require("../Controller/loginController");
const { HomePage } = require("../Controller/homeController");
const { Addorders } = require("../Controller/ordersController");
const { ViewCart } = require("../Controller/cartController");


router.post("/checkout", async (req, res) => {
  try {
    const auth_token = req.headers.authorization.split(" ")[1];
    const { token } = await req.body;
    var loginCredentials = await AuthorizeUser(auth_token);
    if (loginCredentials === false) {
      res.status(200).send("login");
    } else {
      try {
        var restaurantList = await HomePage();
        await Addorders(loginCredentials.email,token,ViewCart(restaurantList, loginCredentials));
        res.status(200).json(true);
      } catch (error) {
        res.status(400).json(false);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("login");
  }
});

router.get("/view", async (req, res) => {
  try {
    const auth_token = req.headers.authorization.split(" ")[1];
    var loginCredentials = await AuthorizeUser(auth_token);
    if (loginCredentials === false) {
      res.status(400).send("login");
    } else {
      res.json(loginCredentials.order);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("login");
  }
});

module.exports = router;
