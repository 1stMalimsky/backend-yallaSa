const initialUsers = require("./initialUsers");
const User = require("../userModel");
const chalk = require("chalk");

const createUsers = async () => {
  try {
    const usersCreated = await User.find();
    if (usersCreated.length > 0) {
      console.log(chalk.blue.italic("users already created"));
      return;
    }
    const result = await User.insertMany(initialUsers);
    return console.log(chalk.green("users created"));
  } catch (error) {
    console.log(error);
  }
};

const findOwners = async () => {
  try {
    const ownersArr = await User.find({ isOwner: true });
    if (ownersArr.length === 0) {
      console.log("No owners found");
      return false;
    }
    console.log("users that  are owners", ownersArr);
    return ownersArr;
  } catch (err) {
    console.log("find owners error", err);
  }
};

module.exports = { createUsers, findOwners };
