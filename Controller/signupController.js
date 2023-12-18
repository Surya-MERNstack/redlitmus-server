const UserRegistration = require("../Models/UserRegistration");
const VerifyUser = require("../Models/VerifyUser");
const { sendMail } = require("../Controller/SendMail");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

async function InsertSignUpUser(token) {
  try {
    const userVerify = await VerifyUser.findOne({ token: token });
    if (userVerify) {
      const newUser = new UserRegistration({
        name: userVerify.name,
        email: userVerify.email,
        password: userVerify.password,
        phone: userVerify.phone,
        cart: [],
        order: [],
        address: [],
        forgetPassword: {},
      });
      await newUser.save();
      await userVerify.deleteOne({ token: token });
      const content = `
  <h4>Hi there,</h4>
  <h5>Welcome to Swiggy Clone</h5>
  <p>our account has been successfully registered in swiggy clone</p>
  <p>Click below link to login into your account.</p>
  <a href="https://master--praveenswiggycloneapp.netlify.app/">https://master--praveenswiggycloneapp.netlify.app//</a>`;
      sendMail(newUser.email, "Registration Successful", content);
      return `
      <html>
        <head>
          <title>Registration Successful</title>
        </head>
        <body>
          <h1>Registration Successful</h1>
          <p>Your account has been successfully registered in swiggy clone.</p>
          <p>Click below link to login into your account.</p>
          <a href="https://master--praveenswiggycloneapp.netlify.app/">https://master--praveenswiggycloneapp.netlify.app/</a>
        </body>
      </html>`;
    }
    return `<html>
    <head>
      <title>Registration Failed</title>
    </head>
    <body>
      <h1>Registration Failed</h1>
      <p>Link Expired...</p>
    </body>
  </html>`;
  } catch (error) {
    console.log(error);
    return `<html>
    <head>
      <title>Registration Failed</title>
    </head>
    <body>
      <h1>Registration Failed</h1>
      <p>Unexpected error happend, Please sign in again</p>
    </body>
  </html>`;
  }
}

async function InsertVerifyUser(
  nameSignup,
  emailIdSignup,
  passwordSignup,
  phoneSignup
) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(passwordSignup, salt);
  token = generateToken(emailIdSignup);
  const newUser = new VerifyUser({
    name: nameSignup,
    email: emailIdSignup,
    password: hashedPassword, 
    phone: phoneSignup,
    token: token,
  });
  const activationLink = `/signup/${token}`;
  const content = `
  <h4>Hi there,</h4>
  <h5>Welcome to Swiggy Clone</h5>
  <p>Thank you for signing up. Please click the link below to activate your account:</p>
  <a href="${activationLink}">${activationLink}</a>
  <p>Regards,</p>
  <p>Swiggy</p>
  `;

  await newUser.save();
  sendMail(emailIdSignup, "Verify User", content);
}

function generateToken(emailIdSignup) {
  const token = jwt.sign(emailIdSignup, process.env.signup_Secret_Token);
  return token;
}

module.exports = { InsertSignUpUser, InsertVerifyUser };
