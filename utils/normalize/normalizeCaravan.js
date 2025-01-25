const kitchenFeatures = {
  hasSink: false,
  hasStove: false,
  hasMicrowave: false,
  hasOven: false,
  hasFridge: false,
  hasDiningTable: false,
  hasKitchenware: false,
};

const bathroomFeatures = {
  hasToilet: false,
  hasIndoorShower: false,
  hasOutdoorShower: false,
};

const vehicleProps = {
  hasFireExtinguisher: false,
  hasFirstAidKit: false,
  hasSmokeDetector: false,
  hasBackupCamera: false,
  hasBackupSensor: false,
  hasLevelingJack: false,
  hasTowHitch: false,
};

const caravanProps = {
  hasTV: false,
  hasAC: false,
  hasShabbatSystem: false,
  hasAwning: false,
  hasElectricity: false,
  hasWaterHose: false,
  hasGenerator: false,
  hasGPS: false,
  hasBikeRack: false,
  hasLinen: false,
  hasSolar: false,
};

const normalizeFeatures = (featuresArray, defaultFeatures) => {
  const normalizedFeatures = { ...defaultFeatures };

  featuresArray.forEach((item) => {
    Object.keys(item).forEach((feature) => {
      if (feature in normalizedFeatures) {
        normalizedFeatures[feature] = true;
      }
    });
  });

  return normalizedFeatures;
};

const normalizeCaravan = (caravan) => {
  console.log("Received caravan data", caravan);

  const normalizedData = {
    carType: caravan.vehicleType,
    personCapacity: {
      numOfBeds: +caravan.numOfbeds,
      numOfSeats: +caravan.numOfseats,
      numOfSleepers: +caravan.numOfsleepers,
    },
    licenseDetails: {
      licenseRequired: caravan.measurements.licenseClass,
      licensePlateNumber: caravan.licenseNumber,
      model: caravan.carModel,
      year: +caravan.carYear,
      //licenseImages: caravan.base64Data, // Assuming structure includes the base64Data directly under caravan
    },
    ownerDetails: {
      ownerId: caravan.userDetails.userId,
      isBusiness: caravan.privateUser === "false" ? true : false,
      businessDetails: {
        companyId: caravan.userDetails.companyId,
        companyName: caravan.userDetails.companyName,
        officePhone: caravan.userDetails.companyPhone,
        city: caravan.userDetails.companyCity,
        street: caravan.userDetails.companyStreet,
        email: caravan.userDetails.companyEmail,
      },
      //caravanImages: caravan.caravanImages, // Assuming this structure is correct; adjust if needed
    },
    features: {
      kitchen: normalizeFeatures(caravan.kitchen, kitchenFeatures),
      bathroom: normalizeFeatures(caravan.bathroom, bathroomFeatures),
      vehicleProps: normalizeFeatures(caravan.safety, vehicleProps), // Assuming safety includes vehicle props
      caravanProps: normalizeFeatures(caravan.comfort, caravanProps), // Assuming comfort includes caravan props
    },
    kosherCaravan: caravan.isKosher || false,
    measurements: caravan.measurements,
    locationDetails: {
      city: caravan.city,
      street: caravan.street,
      houseNumber: caravan.houseNumber,
      gpsLocation: caravan.mapsLocation,
    },
    listingName: caravan.listingName,
    description: caravan.description,
    priceDetails: {
      pricePerNight: +caravan.pricePerNight,
      minimumNights: +caravan.minimumNights,
    },
    insuranceDetails: {
      basicIncluded: caravan.insuranceIncluded,
      premiumPricePerNight: +caravan.premiumInsurance,
      premiumAvailable: caravan.premiumInsurance !== "",
      basicPricePerNight: +caravan.basicInsurance,
    },
    cancellationPolicy: {
      isCancellationPolicy: caravan.isCancelationPolicy,
      freeCancelWindow: +caravan.freeCancelationDays,
      cancellationFeePercent: +caravan.cancelationPrice,
    },
    rating: {
      rating: +caravan.rating || "",
      numOfReviews: +caravan.numOfReviews || "",
    },
  };

  console.log("Normalized Caravan Data", normalizedData);

  return normalizedData;
};

module.exports = { normalizeCaravan };
