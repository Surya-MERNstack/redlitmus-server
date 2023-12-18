const RestaurantDetails = require("../Models/RestaurantDetails");
const mongoose = require("mongoose");

async function HomePage() {
  const restaurantList =  await RestaurantDetails.find().lean();
  return restaurantList;
}

module.exports = { HomePage };
