const { createUsers } = require("./users/helpers/createInitialUsers");
const { createCaravans } = require("./caravans/helpers/createInitialCaravans");
const createReservations = require("./reservations/helpers/createInitialReservations");
const createReviews = require("./reviews/helpers/createInitialReviews");
const chalk = require("chalk");

const createInitialData = async () => {
  try {
    await createUsers();
    await createCaravans();
    await createReservations();
    await createReviews();
    console.log(chalk.green("initial data created"));
  } catch (err) {
    console.log(chalk.red.bold("create initial date err"), err);
  }
};

module.exports = { createInitialData };
