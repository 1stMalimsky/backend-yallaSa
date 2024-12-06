const Caravan = require("./caravanModel");

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

module.exports = {
  createCaravan,
  getCaravanById,
  getAllCaravans,
  updateCaravan,
  deleteCaravan,
};
