const Owner = require("../ownerModel");
const userService = require("../../users/userService");
const initialCaravans = require("../../caravans/helpers/initialCaravans");
const initialOwners = require("./initialOwners");
const User = require("../../users/userModel");

const findOwners = async () => {
  try {
    const ownersArr = await Owner.find();
    if (ownersArr.length === 0) {
      console.log("No owners found");
      return false;
    }
    const userAreOwners = await User.find({ isOwner: true });
    if (userAreOwners.length === 0) {
      return console.log("No owners found");
    }
    const result = userAreOwners.map((user) => {
      const owner = ownersArr.find((owner) => owner.userId === user._id);
    });
    console.log("user are owners", userAreOwners);
  } catch (err) {
    console.log("find owners error", err);
  }
};
module.exports = findOwners;
