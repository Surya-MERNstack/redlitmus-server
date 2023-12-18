const mongoose = require("mongoose");
const RestaurantDetails = require("../Models/RestaurantDetails");

async function DetailsPage(id) {
  try {
    const detailList = await RestaurantDetails.findById(id).lean();
    return detailList;
  } catch (error) {
    console.error(error);
    return error;
  }
}

module.exports = { DetailsPage };
