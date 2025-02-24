const { sendEmail } = require("../nodeMailer/nodeMailer");
const loadEmailTemplates = require("./loadEmailTemplates");
const dayjs = require("dayjs");

/**
 * Sends a reservation confirmation email.
 * @param {string} userEmail - The recipient's email.
 * @param {object} reservationData - Reservation details.
 */
const sendReservationConfirmation = async (reservationData, additionalData) => {
  console.log("reservation Data", reservationData);

  const template = loadEmailTemplates("reservationConfirmation");
  const userEmail = "alonmalichi@gmail.com"; /* reservationData.email */
  const replacements = {
    userName: reservationData.userName || "אורח",
    caravanName: reservationData.listingName,
    checkInDate: dayjs(reservationData.dates.start * 1000).format("DD/MM/YYYY"),
    checkOutDate: dayjs(reservationData.dates.end * 1000).format("DD/MM/YYYY"),
    city: reservationData.location.city,
    street: reservationData.location.street,
    houseNumber: reservationData.location.houseNumber,
    gpsLocation: reservationData.location.gpsLocation || null,
    totalPrice: reservationData.priceDetails.grandTotal,
    manageReservationUrl: additionalData.manageReservationUrl,
  };

  await sendEmail(
    userEmail,
    "ההזמנה שלך אושרה! יאללה סע 🎉",
    template,
    replacements
  );
};

const sendOwnerReservationEmail = async (
  ownerEmail,
  reservationData,
  additionalDataOwner
) => {
  const template = loadEmailTemplates("ownerConfirmation");

  const replacements = {
    ownerName: additionalDataOwner.ownerName,
    caravanName: reservationData.listingName,
    customerName: reservationData.userName,
    checkInDate: dayjs(reservationData.dates.start * 1000).format("DD/MM/YYYY"),
    checkOutDate: dayjs(reservationData.dates.end * 1000).format("DD/MM/YYYY"),
    totalPrice: reservationData.priceDetails.grandTotal,
    manageReservationUrl: additionalDataOwner.manageReservationUrl,
    currentYear: new Date().getFullYear(),
    supportUrl: "https://yourwebsite.com/contact",
  };

  await sendEmail(
    "alonmalichi@gmail.com" /* ownerEmail */,
    "📢 הזמנה חדשה לקרוואן שלך!",
    template,
    replacements
  );
};

const sendOwnerCancelationEmail = async (reservationData, additionalData) => {
  const template = loadEmailTemplates("ownerCancelationEmail");

  const replacements = {
    ownerName: additionalData.ownerName,
    caravanName: reservationData.listingName,
    customerName: reservationData.userName,
    checkInDate: dayjs(reservationData.dates.start * 1000).format("DD/MM/YYYY"),
    checkOutDate: dayjs(reservationData.dates.end * 1000).format("DD/MM/YYYY"),
    city: reservationData.location.city,
    street: reservationData.location.street,
    houseNumber: reservationData.location.houseNumber,
    platformName: "YourPlatform",
    platformWebsite: "https://yourwebsite.com",
    supportEmail: "support@yourwebsite.com",
    resManagementLink: `localhost:3000/loginredirect/${additionalData.ownerId}/resManagment`,
  };

  await sendEmail(
    "alonmalichi@gmail.com" /* ownerEmail */,
    "🚨 הזמנה לקרוואן שלך בוטלה",
    template,
    replacements
  );
};

const sendUserCancelationEmail = async (reservationData, additionalData) => {
  const template = loadEmailTemplates("userCancelationEmail");

  const replacements = {
    userName: reservationData.userName,
    caravanName: reservationData.listingName,
    ownerName: additionalData.ownerName,
    checkInDate: dayjs(reservationData.dates.start * 1000).format("DD/MM/YYYY"),
    checkOutDate: dayjs(reservationData.dates.end * 1000).format("DD/MM/YYYY"),
    city: reservationData.location.city,
    street: reservationData.location.street,
    houseNumber: reservationData.location.houseNumber,
    platformWebsite: "localhost:3000",
    /* supportEmail: "support@yourwebsite.com", */
    /* browseLink: "https://yourwebsite.com/browse", */
  };

  await sendEmail(
    "alonmalichi@gmail.com" /* userEmail */,
    "🚨 ההזמנה שלך בוטלה",
    template,
    replacements
  );
};

module.exports = {
  sendReservationConfirmation,
  sendOwnerReservationEmail,
  sendOwnerCancelationEmail,
  sendUserCancelationEmail,
};
