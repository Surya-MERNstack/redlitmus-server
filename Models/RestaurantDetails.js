const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema(
  {
    res_name: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    dishes: [
      {
        dish_id: mongoose.Schema.Types.ObjectId,
        dish_name: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
        dish_image_url: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
      },
    ],
    coupon: {
      type: String,
    },
    offer: {
      type: String,
    },
  },
  { collection: "RestaurantDetails" }
);

const RestaurantDetails = mongoose.model("Moogoose", RestaurantSchema);

module.exports = RestaurantDetails;
