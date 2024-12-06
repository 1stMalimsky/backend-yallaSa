const Reservation = require("./reservationModel");

const createReservation = (reservationInput) => {
  const reservation = new Reservation(reservationInput);
  return reservation.save();
};

const getReservationById = (reservationId) => {
  return Reservation.findOne({ _id: reservationId });
};

const getAllReservations = () => {
  return Reservation.find();
};

const updateReservation = (reservationId, updatedReservation) => {
  return Reservation.findByIdAndUpdate(reservationId, updatedReservation, {
    new: true,
  });
};

const deleteReservation = (reservationId) => {
  return Reservation.deleteOne({ _id: reservationId });
};

module.exports = {
  createReservation,
  getReservationById,
  getAllReservations,
  updateReservation,
  deleteReservation,
};
