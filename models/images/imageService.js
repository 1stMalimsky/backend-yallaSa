const CaravanImage = require("../images/caravanImgModel");
const LicenseImage = require("../images/licenseImgModel");
const UserImage = require("../images/userImageModel");

const searchCaravanImages = async (caravanId) => {
  try {
    const caravanImages = await CaravanImage.find({ caravanId: caravanId });
    //console.log("caravanImages img service", caravanImages.length);

    return caravanImages;
  } catch (error) {
    console.error("Error searching for caravan images:", error);
    throw error;
  }
};

const searchCaravanLicenseImages = async (caravanId) => {
  try {
    const licenseImages = await LicenseImage.find({ caravanId: caravanId });
    return licenseImages;
  } catch (error) {
    console.error("Error searching for caravan images:", error);
    throw error;
  }
};

const getLicenseImages = async (caravanId) => {
  try {
    const licenseImages = await LicenseImage.find({ caravanId: caravanId });
    if (licenseImages.length === 0) {
      return console.log("no license Images found");
    } else {
      console.log("licenseImages", licenseImages);
      return licenseImages;
    }
  } catch (error) {
    console.error("Error searching for license images:", error);
    throw error;
  }
};

const getUserImages = async (userId) => {
  try {
    const userImages = await UserImage.find({ userId: userId });
    if (!userImages) {
      return console.log("no userImages found");
    } else return userImages;
  } catch (error) {
    console.error("Error searching for caravan images:", error);
    throw error;
  }
};

const deleteImage = async (userId, imageId, imageType) => {
  /* imageTypes: UserImage, LicenseImage,CaravanImage */
  const foundImage = await imageType.findById(imageId);
  if (foundImage.userId.toString() !== userId) {
    return console.log("user not authorized to delete this image");
  }
  const deletedImage = await imageType.findByIdAndDelete(imageId);
  if (!deletedImage) {
    return res.status(404).json({ message: "Image not deleted or not found" });
  }
  return console.log("imageDeleted", deletedImage);
};

module.exports = {
  searchCaravanImages,
  searchCaravanLicenseImages,
  deleteImage,
  getUserImages,
  getLicenseImages,
};
