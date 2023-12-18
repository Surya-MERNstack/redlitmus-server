const express = require("express");
var router = express.Router();
const { AuthorizeUser } = require("../Controller/loginController");
const { DetailsPage } = require("../Controller/detailsController");
const { CheckCartDetails } = require("../Controller/cartController");

router.get("/:id", async function (req, res) {
  try {
    const auth_token = req.headers.authorization.split(" ")[1];
    var loginCredentials = await AuthorizeUser(auth_token);
    if (loginCredentials === false) {
      res.status(200).send("login");
    } else {
      const foodItems = await DetailsPage(req.params.id);
      res.json(CheckCartDetails(foodItems, loginCredentials));
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("login");
  }
});

module.exports = router;
