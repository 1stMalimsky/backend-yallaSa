const User = require("./userModel");

/* MISSING LOGIN WITH TOKEN CREATION */

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
  return User.findByIdAndUpdate(userId, updatedUser, {
    new: true,
  });
};

deleteUser = (userId) => {
  return User.deleteOne({ _id: userId });
};

module.exports = {
  registerUser,
  getUserByEmail,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
