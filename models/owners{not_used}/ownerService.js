const Owner = require("./ownerModel");

const registerOwner = (ownerInput) => {
  const owner = new Owner(ownerInput);
  return owner.save();
};

const getOwnerByEmail = (email) => {
  return Owner.findOne({ email: email });
};

const getOwnerById = (ownerId) => {
  return Owner.findOne({ _id: ownerId });
};

const getAllOwners = () => {
  return Owner.find();
};

const updateOwner = (ownerId, updatedOwner) => {
  return Owner.findByIdAndUpdate(ownerId, updatedOwner, {
    new: true,
  });
};

const deleteOwner = (ownerId) => {
  return Owner.deleteOne({ _id: ownerId });
};

module.exports = {
  registerOwner,
  getOwnerByEmail,
  getAllOwners,
  getOwnerById,
  updateOwner,
  deleteOwner,
};
