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
        phone: caravan.userDetails.phone,
        city: caravan.userDetails.city,
        street: caravan.userDetails.street,
        email: caravan.userDetails.email,
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
      gpsData: caravan.mapsLocation,
      pickupTime: caravan.pickupTime,
      dropoffTime: caravan.dropoffTime,
    },
    listingName: caravan.listingName,
    description: caravan.description,
    priceDetails: {
      pricePerNight: +caravan.pricePerNight,
      minimumNights: +caravan.minimumNights,
    },
    insuranceDetails: {
      basicIncluded: caravan.insuranceIncluded === "true" ? true : false,
      premiumAvailable: +caravan.premiumInsurance > 0 ? true : false,
      premiumPricePerNight: +caravan.premiumInsurance,
      basicPricePerNight: +caravan.basicInsurance,
    },
    cancelationPolicy: {
      isCancelationPolicy:
        caravan.isCancelationPolicy === "true" ? true : false,
      freeCancelWindow:
        caravan.isCancelationPolicy === "true"
          ? +caravan.freeCancelationDays
          : 0,
      cancelationFeePercent:
        caravan.isCancelationPolicy === "true" ? +caravan.cancelationPrice : 0,
    },
    rating: {
      rating: +caravan.rating || "",
      numOfReviews: +caravan.numOfReviews || "",
    },
    extras: {
      bbq: {
        isAvailable: caravan.extras.bbq.isAvailable,
        price: +caravan.extras.bbq.price,
      },
      extraLinen: {
        isAvailable: caravan.extras.extraLinen.isAvailable,
        price: +caravan.extras.extraLinen.price,
      },
      tent: {
        isAvailable: caravan.extras.tent.isAvailable,
        price: +caravan.extras.tent.price,
      },
      extraGas: {
        isAvailable: caravan.extras.extraGas.isAvailable,
        price: +caravan.extras.extraGas.price,
      },
      picnicSet: {
        isAvailable: caravan.extras.picnicSet.isAvailable,
        price: +caravan.extras.picnicSet.price,
      },
      cleaningService: {
        isAvailable: caravan.extras.cleaningService.isAvailable,
        price: +caravan.extras.cleaningService.price,
      },
      kosherCaravan: caravan.kosherCaravan || false,
    },
  };

  console.log("Normalized Caravan Data", normalizedData);

  return normalizedData;
};

module.exports = { normalizeCaravan };
