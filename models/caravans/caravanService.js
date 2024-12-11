const Caravan = require("./caravanModel");
const reservationService = require("../reservations/reservationService");
const dayjs = require("dayjs");

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

const searchAvailabilityByDate = async (
  queryStart,
  queryEnd,
  page = 1,
  limit = 2
) => {
  const startDate = dayjs.unix(queryStart);
  const queryMonth = startDate.month();
  const queryYear = startDate.year();
  const skip = (page - 1) * limit;
  const excludedCaravanIds = [];

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

    const availableCaravans = await Caravan.find({
      _id: { $nin: excludedCaravanIds },
    })
      .skip(skip)
      .limit(limit);

    const totalAvailable = await Caravan.countDocuments({
      _id: { $nin: excludedCaravanIds },
    });
    return availableCaravans;
    /* return {
      caravans: availableCaravans,
      availableCaravans: totalAvailable,
      page,
      totalPages: Math.ceil(totalAvailable / limit),
    }; */
  } catch (error) {
    console.log("search for caravan error", error);
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
