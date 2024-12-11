const Caravan = require("../caravanModel");
const initialCaravans = require("./initialCaravans");
const findOwners = require("../../users/helpers/createInitialUsers").findOwners;
const chalk = require("chalk");

const createCaravans = async () => {
  try {
    const findCaravans = await Caravan.find();
    if (findCaravans.length > 0) {
      console.log(chalk.blue.italic("caravans already created"));
      return;
    }
    const owners = await findOwners();
    //const ownerIds = owners.map((owner) => owner._id);
    console.log("owners", owners);
    const result = await Caravan.insertMany(initialCaravans);
    console.log(chalk.green("caravans created"));
    return;
  } catch (error) {
    console.log(error);
  }
};

const createCaravanId = () => {
  return new mongoose.Types.ObjectId();
};

module.exports = { createCaravans, createCaravanId };
