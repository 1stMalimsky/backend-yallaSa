const express = require("express");
const { reservationService } = require("../models/serviceIndex");
const Reservation = require("../models/reservations/reservationModel");
const BlockedDate = require("../models/reservations/blockedDateModel");
const userService = require("../models/users/userService");
const Caravan = require("../models/caravans/caravanModel");
const router = express.Router();
const chalk = require("chalk");
const { loggedInCheck, checkCredentials } = require("./helpers/middleware");
const { sendEmail } = require("../utils/nodeMailer/nodeMailer");
const cancelRequestEmail = require("../utils/nodeMailer/cancelationRequestMessage");
const {
  sendReservationConfirmation,
  sendOwnerReservationEmail,
  sendUserCancelationEmail,
  sendOwnerCancelationEmail,
} = require("../utils/nodeMailer/emailTypes");

/* CREATE RESERVATION */
router.post("/create", async (req, res) => {
  try {
    const userId = req.body.userId;
    const newReservation = await reservationService.createReservation(req.body);
    if (newReservation) {
      const updateUser = await userService.updateUser(userId, {
        $push: { userReservations: newReservation._id },
      });
      const updateOwner = await userService.updateUser(newReservation.ownerId, {
        $push: { ownerReservations: newReservation._id },
      });

      const ownerDetails = await userService.getUserById(
        newReservation.ownerId
      );
      const additionalDataUser = {
        manageReservationUrl: `http://localhost:3000/loginredirect/${userId}/userResManagement`,
      };

      const additionalDataOwner = {
        manageReservationUrl: `http://localhost:3000/loginredirect/${newReservation.ownerId}/resmanagement`,
        ownerName: ownerDetails.fullName,
      };

      console.log("ownerDetails", ownerDetails);

      sendReservationConfirmation(req.body, additionalDataUser);
      sendOwnerReservationEmail(
        ownerDetails.email,
        req.body,
        additionalDataOwner
      );
      res.status(201).json({
        message: "Reservation created successfully",
        newRes: newReservation,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Create reservation Error", error: error.message });
  }
});

/* GET BLOCKED DATES */

router.get("/blockeddates/", loggedInCheck, async (req, res) => {
  try {
    const ownerId = req.tokenPayload.userId;
    const blockedDates = await BlockedDate.find({ ownerId: ownerId });
    res.status(200).json(blockedDates);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting blocked dates", error: error });
  }
});
/* BLOCK AVAILABILITY */
router.post(
  "/blockavailability/:caravanId",
  loggedInCheck,
  async (req, res) => {
    const caravanId = req.params.caravanId;
    const title = req.body.title;
    try {
      const ownerId = req.tokenPayload.userId;
      const date = req.body.date;
      const existingBlock = await BlockedDate.findOne({
        ownerId,
        caravanId,
        date,
      });
      if (existingBlock) {
        return res
          .status(400)
          .json({ message: "This date is already blocked" });
      }
      const addBlock = await reservationService.blockDate({
        ownerId: ownerId,
        caravanId: caravanId,
        title: title,
        date: date,
      });
      res.status(201).json({
        message: "Blocked dates added successfully",
        addBlock: addBlock,
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ message: "server error", error: err });
    }
  }
);

/* DELETE BLOCKED DATES */
router.delete(
  "/deleteblock/:caravanId/:date",
  loggedInCheck,
  async (req, res) => {
    try {
      const caravanId = req.params.caravanId;
      const ownerId = req.tokenPayload.userId;
      const foundCaravan = await BlockedDate.find({ ownerId, caravanId });
      const date = req.params.date;
      console.log("foundCaravan", foundCaravan);
      console.log("date", date);

      const blockedDate = await BlockedDate.findOneAndDelete({
        ownerId,
        caravanId,
        date,
      });
      if (!blockedDate) {
        return res.status(404).json({ message: "Blocked date not found" });
      }

      res.status(200).json({ message: "Date unblocked successfully" });
    } catch (err) {
      console.error("Error unblocking date:", err);
      res.status(500).json({ message: "Internal server error", error: err });
    }
  }
);

/* GET OWNER RES DATA*/
router.get("/ownerResData/:ownerId", loggedInCheck, async (req, res) => {
  if (req.params.ownerId != req.tokenPayload.userId) {
    res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const resIdArr = JSON.parse(req.query.ownerReservations);
    const reservationData = await Reservation.find({ _id: { $in: resIdArr } });
    console.log("response", reservationData);

    res.status(200).json(reservationData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Get owner reservations Error", error: error.message });
  }
});

/* GET USER RES DATA*/
router.get("/userResData/:userId", loggedInCheck, async (req, res) => {
  if (req.params.userId != req.tokenPayload.userId) {
    res.status(401).json({ message: "Unauthorized" });
  }
  const resArr = await reservationService.getUserReservation(req.params.userId);

  res.status(200).json(resArr);
  try {
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "getUserRes Server error", error: err });
  }
});

/* GET ALL RESERVATIONS */
router.get(
  "/all",
  loggedInCheck,
  checkCredentials((needAdmin = true), (needOwner = true)),
  async (req, res) => {
    try {
      const reservations = await reservationService.getAllReservations();
      res
        .status(200)
        .json({ message: "All reservations", reservations: reservations });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Get All Reservations Err", error: error.message });
    }
  }
);

/* GET RESERVATIO BY RES ID */
router.get("/:reservationId", async (req, res) => {
  try {
    const foundReservations = await reservationService.getReservationById(
      req.params.reservationId
    );
    if (!foundReservations || foundReservations.length === 0) {
      res.status(400).json("No reservation Found");
    } else {
      res.status(200).send({ found_reservation: foundReservations });
    }
  } catch (err) {
    res
      .status(400)
      .json({ message: "Find reservation by is error", error: err.message });
  }
});

/* GET OWNER RESERVATIONS BY USER ID */
router.get(
  "/owner/:ownerId/:type",
  loggedInCheck,
  checkCredentials((needAdmin = false), (needOwner = true)),
  async (req, res) => {
    try {
      const response = await reservationService.findOwnerReservations(
        req.params.ownerId,
        req.params.type
      );
      if (response) {
        res.status(200).json({ responseData: response });
      } else {
        res.json({
          message: "no res found",
        });
      }
    } catch (err) {
      console.error("get res error", err);
    }
  }
);

/* UPDATE RESERVATION */
router.put("/:reservationId", async (req, res) => {
  try {
    const foundReservation = await reservationService.getReservationById(
      req.params.reservationId
    );
    if (!foundReservation || foundReservation.length === 0) {
      res.status(400).json("No reservation Found");
    } else {
      const updatedReservation = await reservationService.updateReservation(
        req.params.reservationId,
        req.body
      );
      res
        .status(200)
        .send({ message: "Reservation Updated", updatedReservation });
    }
  } catch (err) {
    res
      .status(400)
      .json({ message: "Find reservation by is error", error: err.message });
  }
});

/* DELETE RESERVATION */
router.delete("/:reservationId", async (req, res) => {
  try {
    const foundReservation = await reservationService.getReservationById(
      req.params.reservationId
    );
    const resId = req.params.reservationId;
    if (!foundReservation || foundReservation.length === 0) {
      res.status(400).json("No reservation Found");
    } else {
      const deletedReservation = await reservationService.deleteReservation(
        resId
      );
      const updatedUser = await User.findByIdAndUpdate(
        foundReservation.userId,
        { $pull: { userReservations: resId } },
        { new: true }
      );
      const updateOwner = await User.findByIdAndUpdate(
        foundReservation.ownerId,
        { $pull: { ownerReservations: resId } },
        { new: true }
      );
      res.status(200).send({ message: "Reservation Deleted" });
    }
  } catch (err) {
    res
      .status(400)
      .json({ message: "Find reservation by is error", error: err.message });
  }
});

/* OWNER MESSAGE RESERVATION */

router.post("/messageclient/:ownerId/", loggedInCheck, async (req, res) => {
  const message = req.body.message;
  const email = req.body.email;
  let subject = "";
  try {
    const foundOwner = await userService.getUserById(req.params.ownerId);
    if (!foundOwner) {
      return res.status(404).json({ message: "Owner not found" });
    }
    let nameToShow = "";
    if (foundOwner.businessDetails.companyName) {
      nameToShow = foundOwner.businessDetails.companyName;
    } else nameToShow = foundOwner.fullName;
    subject = `יש לך הודעה מ${nameToShow}. יאללה סע!`;
    console.log("req.body=", req.body);
    await sendEmail(email, subject, message);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Error:", err);
  }
});

/* OWNER CANCEL REQUEST MESSAGE  */
router.post(
  "/messageclient/cancel/:ownerId",
  loggedInCheck,
  async (req, res) => {
    const email = req.body.email;
    let subject = "";
    try {
      const foundOwner = await userService.getUserById(req.params.ownerId);
      if (!foundOwner) {
        return res.status(404).json({ message: "Owner not found" });
      }
      let nameToShow = "";
      if (foundOwner.businessDetails.companyName) {
        nameToShow = foundOwner.businessDetails.companyName;
      } else nameToShow = foundOwner.fullName;
      subject = `${nameToShow} קיבלת בקשה לביטול ההזמנה שלך ביאללה סע!`;
      let message = cancelRequestEmail.replace("{{name}}", nameToShow);

      await sendEmail(email, subject, message);
      res.status(200).json({ message: "Email sent successfully" });
    } catch (err) {
      console.error("Error:", err);
    }
  }
);

/* USER CANCEL REQUEST MESSAGE  */
router.patch("/messageowner/cancel/:resId", loggedInCheck, async (req, res) => {
  const email = req.body.email;
  const userName = req.body.userName;
  try {
    const foundReservation = await reservationService.getReservationById(
      req.params.resId
    );
    const resId = foundReservation._id;

    if (!foundReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    const ownerData = await userService.getUserById(foundReservation.ownerId);

    await reservationService.updateReservation(resId, {
      status: "canceled",
    });

    console.log("resId", resId);

    await userService.removeReservation(
      foundReservation.ownerId,
      resId,
      "owner"
    );

    await userService.removeReservation(foundReservation.userId, resId, "user");
    /*     const additionalData = {
      ownerName: ownerData.businessDetails
        ? ownerData.businessDetails.email
        : ownerData.fullName,
      ownerEmail: ownerData.businessDetails
        ? ownerData.businessDetails.email
        : ownerData.email,
      ownerId: ownerData._id,
    };
    await sendUserCancelationEmail(foundReservation, additionalData);
    await sendOwnerCancelationEmail(foundReservation, additionalData);
 */
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Error:", err);
  }
});

/* USER MESSAGE RESERVATION */
router.post("/messageowner/:reservationId", loggedInCheck, async (req, res) => {
  const message = req.body.message;
  const email = req.body.email;
  const userName = req.body.userName;
  let subject = "";
  try {
    subject = `יש לך הודעה מ${userName}. יאללה סע!`;
    console.log("req.body=", req.body);
    await sendEmail(email, subject, message);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Error:", err);
  }
});

/* GET CARAVAN AVALABILITY */
router.get("/caravanavailability/:caravanId/:month/:year", async (req, res) => {
  const carId = req.params.caravanId;
  const month = req.params.month;
  const year = req.params.year;
  try {
    const caravanAvailability =
      await reservationService.getCaravanReservationsByMonth(
        carId,
        month,
        year
      );
    res.status(200).json(caravanAvailability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* GET BLOCKED RESERVATIONS */
router.get("/caravanavailability/:date", async (req, res) => {
  const date = req.params.date;
  try {
    const blockedReservations = await BlockedDate.findOne(date);
    res.status(200).json(blockedReservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
