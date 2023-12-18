var express = require("express");
var router = express.Router();
const { AuthorizeUser } = require("../Controller/loginController");
const {
  EditProfile,
  SaveAddress,
  DeleteAddress,
  SetPrimaryAddress,
  EditAddress,
} = require("../Controller/profileController");

router.get("/", async (req, res) => {
  try {
    const auth_token = req.headers.authorization.split(" ")[1];
    var loginCredentials = await AuthorizeUser(auth_token);
    if (loginCredentials === false) {
      res.status(200).send(null);
    } else {
      const payload = {
        email: loginCredentials.email,
        name: loginCredentials.name,
        phone: loginCredentials.phone,
        address: loginCredentials.address,
      };
      res.json(payload);
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/edit", async (req, res) => {
  try {
    const { profile } = await req.body;
    const auth_token = req.headers.authorization.split(" ")[1];
    var loginCredentials = await AuthorizeUser(auth_token);
    if (loginCredentials === false) {
      res.status(400).send("login");
    } else {
      res.json(await EditProfile(loginCredentials.email, profile));
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("login");
  }
});

router.post("/address/save", async (req, res) => {
  try {
    const auth_token = req.headers.authorization.split(" ")[1];
    const { address } = await req.body;
    var loginCredentials = await AuthorizeUser(auth_token);
    if (loginCredentials === false) {
      res.status(400).send("login");
    } else {
      res.json(await SaveAddress(loginCredentials.email, address));
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("login");
  }
});

router.post("/address/edit", async (req, res) => {
  try {
    const auth_token = req.headers.authorization.split(" ")[1];
    const { address } = await req.body;
    var loginCredentials = await AuthorizeUser(auth_token);
    if (loginCredentials === false) {
      res.status(400).send("login");
    } else {
      res.json(await EditAddress(loginCredentials.email, address));
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("login");
  }
});

router.post("/address/delete", async (req, res) => {
  try {
    const auth_token = req.headers.authorization.split(" ")[1];
    const { id } = await req.body;
    var loginCredentials = await AuthorizeUser(auth_token);
    if (loginCredentials === false) {
      res.status(400).send("login");
    } else {
      res.json(await DeleteAddress(loginCredentials.email, id));
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("login");
  }
});

router.post("/address/set/primary", async (req, res) => {
  try {
    const auth_token = req.headers.authorization.split(" ")[1];
    const { id } = await req.body;
    var loginCredentials = await AuthorizeUser(auth_token);
    if (loginCredentials === false) {
      res.status(200).send("login");
    } else {
      res.json(await SetPrimaryAddress(loginCredentials.email, id));
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("login");
  }
});

module.exports = router;
