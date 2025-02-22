const express = require("express");
const { reservationService } = require("../models/serviceIndex");
const Caravan = require("../models/caravans/caravanModel");
const router = express.Router();
const chalk = require("chalk");
const { loggedInCheck, checkCredentials } = require("./helpers/middleware");
const userService = require("../models/users/userService");

/* CREATE RESERVATION */
router.post("/create", async (req, res) => {
  try {
    const userId = req.body.userId;
    const newReservation = await reservationService.createReservation(req.body);
    if (newReservation) {
      const updateUser = await userService.updateUser(userId, {
        $push: { userReservations: newReservation._id },
      });
      if (updateUser) {
        console.log("user Updated", updateUser);
      }
      res.status(201).json({ message: "Reservation created successfully" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Create reservation Error", error: error.message });
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

router.get("/:reservationId", async (req, res) => {
  try {
    const foundReservation = await reservationService.getReservationById(
      req.params.reservationId
    );
    if (!foundReservation || foundReservation.length === 0) {
      res.status(400).json("No reservation Found");
    } else {
      res.status(200).send({ found_reservation: foundReservation });
    }
  } catch (err) {
    res
      .status(400)
      .json({ message: "Find reservation by is error", error: err.message });
  }
});

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

router.delete("/:reservationId", async (req, res) => {
  try {
    const foundReservation = await reservationService.getReservationById(
      req.params.reservationId
    );
    if (!foundReservation || foundReservation.length === 0) {
      res.status(400).json("No reservation Found");
    } else {
      const deletedReservation = await reservationService.deleteReservation(
        req.params.reservationId
      );
      res.status(200).send({ message: "Reservation Deleted" });
    }
  } catch (err) {
    res
      .status(400)
      .json({ message: "Find reservation by is error", error: err.message });
  }
});

module.exports = router;
