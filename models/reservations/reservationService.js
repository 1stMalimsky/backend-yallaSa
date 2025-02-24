const Reservation = require("./reservationModel");
const BlockedDate = require("../../models/reservations/blockedDateModel");
const dayjs = require("dayjs");

const createReservation = (reservationInput) => {
  const reservation = new Reservation(reservationInput);
  return reservation.save();
};
const blockDate = (blockInfo) => {
  const addBlock = new BlockedDate(blockInfo);
  return addBlock.save();
};

const getReservationById = (reservationId) => {
  return Reservation.findOne({ _id: reservationId });
};

const getUserReservation = (userId) => {
  return Reservation.find({ userId: userId });
};

const findOwnerReservations = (ownerId, type) => {
  const todayUnix = dayjs().startOf("day").unix();
  const oneWeekAgo = dayjs().subtract(7, "day").startOf("day").toDate();
  console.log("todayUnix", todayUnix);

  if (type === "today") {
    return Reservation.find({
      ownerId: ownerId,
      "dates.start": todayUnix,
    });
  }
  if (type === "upcoming") {
    return Reservation.find({
      ownerId: ownerId,
      "dates.start": { $gte: todayUnix },
    })
      .sort({ "dates.start": 1 })
      .exec();
  }
  if (type === "newReservations") {
    return Reservation.find({
      ownerId: ownerId,
      createdAt: { $gte: oneWeekAgo },
    })
      .sort({ createdAt: -1 })
      .exec();
  }
  if (type === "upcomingByCaravan") {
    return Reservation.find({
      ownerId: ownerId,
      "dates.start": { $gte: todayUnix },
    })
      .sort({ caravanId: 1, "dates.start": 1 })
      .exec();
  }
  if (type === "allReservations") {
    return Reservation.find({
      ownerId: ownerId,
    });
  }
};

const getCaravanReservationsByMonth = (caravanId, month, year) => {
  console.log("input", caravanId, month, year);

  return Reservation.find({
    caravanId: caravanId,
    "dates.year": parseInt(year, 10),
    "dates.month": parseInt(month, 10),
  });
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
  findOwnerReservations,
  getCaravanReservationsByMonth,
  blockDate,
  getUserReservation,
};
