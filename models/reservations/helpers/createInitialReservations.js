const Reservation = require("../reservationModel");
const initialReservations = require("./initialReservationsData");
const chalk = require("chalk");

const createReservations = async () => {
  try {
    const reservations = await Reservation.find({});
    if (reservations.length > 0) {
      console.log(chalk.blue.italic("reservations already exist"));
      return;
    }
    await Reservation.insertMany(initialReservations);
    console.log(chalk.green("reservations created"));
  } catch (err) {
    console.log(chalk.red.bold("create intial reservation error"), err);
  }
};

module.exports = createReservations;
