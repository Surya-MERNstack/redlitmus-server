const UserRegistration = require("../Models/UserRegistration");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.Stripe_Key);
const { sendMail } = require("../Controller/SendMail");

async function Addorders(email,token, orderList) {
  let orderTotalPrice = 0; 
  try {
    const currentDate = new Date();
    const options = {
      timeZone: "Asia/Kolkata",
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const currentTime = currentDate
      .toLocaleString("en-IN", options)
      .replace(/\//g, "-")
      .replace(/, /g, " ")
      .replace(/:/g, ".");
    let orderListDetails = [];
    orderList.forEach((data) => {
      const totalPriceForItem = data.quantity * data.price; // Calculate total price for each item
      orderTotalPrice += totalPriceForItem; 
      orderListDetails.push({
        res_id: data.res_id.toString(),
        dish_id: data.dish_id,
        quantity: data.quantity,
        price: data.price,
        res_name: data.res_name,
        dish_name: data.dish_name,
      });
    });
    const orders = {
      id: new mongoose.Types.ObjectId(),
      orderDate: currentTime,
      OrderDetails: orderListDetails,
    };
    await UserRegistration.findOneAndUpdate(
      { email: email },
      { $set: { cart: [] }, $push: { order: orders } }
    );
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: orderTotalPrice,
        currency: 'inr',
        automatic_payment_methods: { enabled: true },
      });
    }
    catch(err){
      console.log(err)
    }
    
      const emailContent = `
        <html>
          <head>
            <title>Payment Success</title>
          </head>
          <body>
            <h1>Your Payment Was Successful!</h1>
            <p>Payment Amount: ₹${orderTotalPrice}</p>
            <p>Date and Time: ${currentTime}</p>
            <p>Thank you for your payment.</p>
            <p>Regards</p>
            <p>Swiggy Clone</p>
          </body>
        </html>
      `;
      sendMail(token.email, "Payment success", emailContent); 
  } catch (error) {
    console.error(error);
  }
}

module.exports = { Addorders };
