const { ObjectId } = require("mongodb");
const UserRegistration = require("../Models/UserRegistration");
const mongoose = require("mongoose");

async function EditProfile(email, profile) {
  try {
    const existingUser = await UserRegistration.findOne({
      email: email,
    });
    existingUser.name = profile.name;
    existingUser.phone = profile.phone;
    await existingUser.save();
  } catch (error) {
    console.error("Error editing profile:", error);
    throw error;
  }
}

async function SaveAddress(emailIdLogin, address) {
  try {
    const existingUser = await UserRegistration.findOne({
      email: emailIdLogin,
    });
    const existingAddress = existingUser.address || [];
    const isPrimary = existingUser.address.length === 0 ? 1 : 0;
    existingAddress.push({
      flatno: address.flatno,
      street: address.street,
      area: address.area,
      city: address.city,
      state: address.state,
      country: address.country,
      pincode: address.pincode,
      isPrimary: isPrimary,
    });
    existingUser.address = existingAddress;
    await existingUser.save();
    return true;
  } catch (error) {
    console.error("Error saving address:", error);
    return false;
  }
}

async function EditAddress(emailIdLogin, address) {
  try {
    const existingUser = await UserRegistration.findOne({
      email: emailIdLogin,
    });
    const existingAddress = existingUser.address || [];
    const updatedAddress = existingAddress.map((addressItem) => {
      if (addressItem._id.toString() === address.id) {
        return {
          _id:addressItem._id,
          flatno: address.flatno,
          street: address.street,
          area: address.area,
          city: address.city,
          state: address.state,
          country: address.country,
          pincode: address.pincode,
          isPrimary: address.isPrimary,
        };
      } else {
        return addressItem;
      }
    });
    existingUser.address = updatedAddress;
    await existingUser.save();
    return true;
  } catch (error) {
    console.error("Error saving address:", error);
    return "login";
  }
}

async function DeleteAddress(email, id) {
  try {
    const existingUser = await UserRegistration.findOne({ email: email });
    const existingAddress = existingUser.address || [];
    const addressToDelete = existingAddress.find(
      (address) => address._id.toString() === id
    );
    if (addressToDelete) {
      if (!addressToDelete.isPrimary) {
        const updatedAddress = existingAddress.filter(
          (address) => address._id.toString() !== id
        );
        existingUser.address = updatedAddress;
        await existingUser.save();
        return true;
      } else {
        return false;
      }
    }
  } catch (error) {
    console.error("Error deleting address:", error);
    return false;
  }
}

async function SetPrimaryAddress(email, id) {
  try {
    const existingUser = await UserRegistration.findOne({ email: email });
    const existingAddress = existingUser.address;
    const addressToSetPrimary = existingAddress.find(
      (address) => address._id.toString() === id
    );
    if (addressToSetPrimary) {
      if (!addressToSetPrimary.isPrimary) {
        addressToSetPrimary.isPrimary = true;
        existingAddress.forEach((address) => {
          if (address._id.toString() !== id) {
            address.isPrimary = false;
          }
        });
        await existingUser.save();
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error deleting address:", error);
    return false;
  }
}

module.exports = {
  EditProfile,
  SaveAddress,
  DeleteAddress,
  SetPrimaryAddress,
  EditAddress,
};
