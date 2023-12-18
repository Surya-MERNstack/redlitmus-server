const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    cart: [
      {
        res_id: String,
        dish_id: String,
        quantity: Number,
      },
    ],
    order: [
      {
        id: mongoose.Schema.Types.ObjectId,
        orderDate: String,
        OrderDetails: [
          {
            res_id: String,
            dish_id: String,
            quantity: Number,
            price: Number,
            res_name: String,
            dish_name: String,
          },
        ],
      },
    ],
    address: [
      {
        id: mongoose.Schema.Types.ObjectId,
        flatno: String,
        street: String,
        area: String,
        city: String,
        state: String,
        country: String,
        pincode: String,
        isPrimary: Boolean,
      },
    ],
    forgetPassword: {
      time: Date,
      otp: String,
    },
  },
  { collection: "UserRegistration" }
);

module.exports = mongoose.model("UserRegistration", userSchema);
