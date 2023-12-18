const UserRegistration = require("../Models/UserRegistration");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
mongoose.connect("mongodb+srv://charusurya17:CharlieDerex17@surya-ecommerce.fkvygn6.mongodb.net/redlitmus_ecom?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function CheckUser(emailIdLogin) {
  try {
    const user = await UserRegistration.findOne({ email: emailIdLogin });
    if (user) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

async function AuthenticateUser(emailIdLogin, passwordLogin) {
  try {
    const userCheck = await UserRegistration.findOne({ email: emailIdLogin });
    const validPassword = await bcrypt.compare(
      passwordLogin,
      userCheck.password
    );
    if (validPassword) {
      const token = jwt.sign(
        { email: emailIdLogin },
        process.env.login_Secret_Token
      );
      return token;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function AuthorizeUser(token) {
  try {
    const decodedToken = jwt.verify(token, process.env.login_Secret_Token);
    if (decodedToken) {
      const email = decodedToken.email;
      const userCheck = await UserRegistration.findOne({ email: email });
      return userCheck;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = { CheckUser, AuthenticateUser, AuthorizeUser };
