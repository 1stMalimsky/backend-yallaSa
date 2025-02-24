const User = require("./userModel");
const mongoose = require("mongoose");

const registerUser = (userInput) => {
  const user = new User(userInput);
  return user.save();
};

const getUserByEmail = (email) => {
  return User.findOne({ email: email });
};

const getUserById = (userId) => {
  return User.findOne({ _id: userId });
};

const getAllUsers = () => {
  return User.find();
};

const updateUser = (userId, updatedUser) => {
  return User.findByIdAndUpdate(userId, { $set: updatedUser }, { new: true });
};

const removeReservation = (userId, reservationId, userType) => {
  if (userType === "owner") {
    console.log("inOwner remove");

    return User.findByIdAndUpdate(
      { _id: userId },
      {
        $pull: { ownerReservations: reservationId },
      },
      { new: true }
    );
  }
  if (userType === "user") {
    console.log("inUser remove");
    return User.findByIdAndUpdate(
      { _id: userId },
      {
        $pull: { userReservations: reservationId },
      },
      { new: true }
    );
  }
};

const deleteUser = (userId) => {
  return User.deleteOne({ _id: userId });
};

module.exports = {
  registerUser,
  getUserByEmail,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  removeReservation,
};
