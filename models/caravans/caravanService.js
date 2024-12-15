const Caravan = require("./caravanModel");
const {
  validateSearch,
} = require("../../validation/serviceValidation/searchValidation");
const Reservation = require("../reservations/reservationModel");
const dayjs = require("dayjs");
const chalk = require("chalk");

const createCaravan = (caravanInput) => {
  const caravan = new Caravan(caravanInput);
  return caravan.save();
};

const getCaravanById = (caravanId) => {
  return Caravan.findOne({ _id: caravanId });
};

const getAllCaravans = () => {
  return Caravan.find();
};

const updateCaravan = (caravanId, updatedCaravan) => {
  return Caravan.findByIdAndUpdate(caravanId, updatedCaravan, {
    new: true,
  });
};

const deleteCaravan = (caravanId) => {
  return Caravan.deleteOne({ _id: caravanId });
};

const searchAvailabilityByDate = async (queryStart, queryEnd, page, limit) => {
  const startDate = dayjs.unix(queryStart);
  const queryMonth = startDate.month() + 1;
  const queryYear = startDate.year();
  let excludedCaravanIds = [];
  const skip = (page - 1) * limit;

  console.log("year", queryYear, "month", queryMonth);

  if (!validateSearch({ start: queryStart, end: queryEnd, page, limit })) {
    throw new Error("Invalid search parameters");
  }
  try {
    const overlappingReservations = await Reservation.find({
      $and: [
        { "dates.year": queryYear },
        { "dates.month": queryMonth },
        {
          $or: [
            {
              "dates.start": { $lte: queryEnd },
              "dates.end": { $gte: queryStart },
            },
          ],
        },
      ],
    }).select("caravanId");

    if (overlappingReservations.length > 0) {
      excludedCaravanIds = overlappingReservations.map(
        (reservation) => reservation.caravanId
      );
    }
    console.log(chalk.bgRed.bold("excludedCaravanIds"), excludedCaravanIds);

    const availableCaravans = await Caravan.find({
      _id: { $nin: excludedCaravanIds },
    })
      .skip(skip)
      .limit(limit);

    const totalAvailable = await Caravan.countDocuments({
      _id: { $nin: excludedCaravanIds },
    });
    return {
      caravans: availableCaravans,
      availableCaravans: totalAvailable,
      page,
      totalPages: Math.ceil(totalAvailable / limit),
    };
  } catch (error) {
    console.log("search for caravan error", error);
    res
      .status(500)
      .json({ message: "searchAvailablilityByDate error", error: error });
  }
};

module.exports = {
  createCaravan,
  getCaravanById,
  getAllCaravans,
  updateCaravan,
  deleteCaravan,
  searchAvailabilityByDate,
};
