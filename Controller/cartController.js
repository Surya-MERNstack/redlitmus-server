const UserRegistration = require("../Models/UserRegistration");
const mongoose = require("mongoose");

async function AddCart(emailIdLogin, updatedCartData) {
  try {
    const existingUser = await UserRegistration.findOne({
      email: emailIdLogin,
    }).lean();
    const existingCart = existingUser.cart || [];
    const { res_id, dish_id, quantity } = updatedCartData;
    let foundMatchingItem = false;
    for (const existingItem of existingCart) {
      if (existingItem.dish_id === dish_id && existingItem.res_id === res_id) {
        existingItem.res_id = res_id;
        existingItem.dish_id = dish_id;
        existingItem.quantity = quantity;
        foundMatchingItem = true;
        break;
      }
    }
    if (!foundMatchingItem) {
      existingCart.push({
        res_id: res_id,
        dish_id: dish_id,
        quantity: quantity,
      });
    }
    await UserRegistration.updateOne(
      { email: emailIdLogin },
      { $set: { cart: existingCart } }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function CheckCart(restaurantList, loginCredentials) {
  const cartItems = loginCredentials.cart;
  const modifiedRestaurantList = restaurantList.map((restaurant) => {
    if (cartItems.length > 0) {
      const dishesWithQuantity = restaurant.dishes.map((dish) => {
        const cartItem = cartItems.find(
          (item) =>
            item.dish_id === dish.dish_id.toString() &&
            item.res_id === restaurant._id.toString()
        );
        const updatedQuantity = cartItem ? cartItem.quantity : "0";
        return {
          ...dish,
          quantity: updatedQuantity,
          res_id: restaurant._id,
          res_name: restaurant.res_name,
        };
      });
      return { ...restaurant, dishes: dishesWithQuantity };
    } else {
      const dishesWithZeroQuantity = restaurant.dishes.map((dish) => {
        return {
          ...dish,
          quantity: "0",
          res_id: restaurant._id,
          res_name: restaurant.res_name,
        };
      });
      return { ...restaurant, dishes: dishesWithZeroQuantity };
    }
  });
  return modifiedRestaurantList;
}

function CheckCartDetails(foodItems, loginCredentials) {
  const cartItems = loginCredentials.cart;
  const modifiedRestaurantList = foodItems.dishes.map((dish) => {
    const cartItem = cartItems.find(
      (item) =>
        item.dish_id === dish.dish_id.toString() &&
        item.res_id === foodItems._id.toString()
    );
    const updatedQuantity = cartItem ? cartItem.quantity : "0";
    return {
      ...dish,
      quantity: updatedQuantity,
      res_id: foodItems._id.toString(),
      res_name: foodItems.res_name,
    };
  });
  return { ...foodItems, dishes: modifiedRestaurantList };
}

function ViewCart(restaurantList, loginCredentials) {
  const modifiedDishes = [];
  const restaurantListCheck = CheckCart(restaurantList, loginCredentials);
  restaurantListCheck.forEach((data) => {
    data.dishes.forEach((dish) => {
      if (dish.quantity > 0) {
        const modifiedDish = {
          ...dish,
        };
        modifiedDishes.push(modifiedDish);
      }
    });
  });
  return modifiedDishes;
}

module.exports = { AddCart, CheckCart, CheckCartDetails, ViewCart };
