var express = require("express");
const { caravanService } = require("../models/serviceIndex");
const mongoose = require("mongoose");
const reservationService = require("../models/reservations/reservationService");
const router = express.Router();
const chalk = require("chalk");
const { loggedInCheck, checkCredentials } = require("./helpers/middleware");
const { normalizeCaravan } = require("../utils/normalize/normalizeCaravan");
const userService = require("../models/users/userService");

/* CREATE CARAVAN */

router.post(
  "/create",
  loggedInCheck,
  checkCredentials((needAdmin = false), (needOwner = true)),
  async (req, res) => {
    try {
      const normalizedCaravan = normalizeCaravan(req.body);
      console.log("normalizedCaravan", normalizedCaravan);

      const newCaravan = await caravanService.createCaravan(normalizedCaravan);
      if (newCaravan) {
        const updatedUser = await userService.updateUser(
          req.tokenPayload.userId,
          { $push: { caravanIds: newCaravan._id } }
        );
        console.log("userUpdated");
      }

      res.status(201).json({ message: "newCaravan created", newCaravan });

      //res.status(201).json({ message: "Caravan created successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Create caravan Error", error: error.message });
    }
  }
);

/* GET ALL CARAVANS */
router.get(
  "/all",
  loggedInCheck,
  checkCredentials((needAdmin = true), (needOwner = false)),
  async (req, res) => {
    try {
      const caravans = await caravanService.getAllCaravans();
      res.status(200).json({ message: "All caravans", caravans: caravans });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Get All Caravans Err", error: error.message });
    }
  }
);

/* GET CARAVAN BY ID */
router.get("/:caravanId", async (req, res) => {
  try {
    const foundCaravan = await caravanService.getCaravanById(
      req.params.caravanId
    );
    if (!foundCaravan || foundCaravan.length === 0) {
      res.status(400).json("No caravan Found");
    } else {
      res.status(200).send({ found_caravan: foundCaravan });
    }
  } catch (err) {
    res
      .status(400)
      .json({ message: "Find caravan by is error", error: err.message });
  }
});

/* UPDATE CARAVAN */
router.put(
  "/:caravanId",
  loggedInCheck,
  checkCredentials((needAdmin = false), (needOwner = true)),
  async (req, res) => {
    const ownerId = req.tokenPayload.userId;
    try {
      const foundCaravan = await caravanService.getCaravanById(
        req.params.caravanId
      );
      if (!foundCaravan || foundCaravan.length === 0) {
        res.status(400).json("No caravan Found");
      } else {
        if (foundCaravan.ownerId !== ownerId) {
          return res
            .status(401)
            .json({ message: "You are not authorized to edit this caravan" });
        } else {
          const updatedCaravan = await caravanService.updateCaravan(
            req.params.caravanId,
            req.body
          );
          res.status(200).json({ message: "Caravan updated successfully" });
        }
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Update caravan Error", error: error.message });
    }
  }
);
/* DELETE CARAVAN */
router.delete(
  "/:caravanId",
  loggedInCheck,
  checkCredentials((needAdmin = false), (needOwner = true)),
  async (req, res) => {
    const ownerId = req.tokenPayload.userId;
    try {
      const foundCaravan = await caravanService.getCaravanById(
        req.params.caravanId
      );
      if (!foundCaravan || foundCaravan.length === 0) {
        res.status(400).json("No caravan Found");
      } else {
        if (foundCaravan.ownerId !== ownerId) {
          return res
            .status(401)
            .json({ message: "You are not authorized to delete this caravan" });
        } else {
          await caravanService.deleteCaravan(req.params.caravanId);
          res.status(200).json({ message: "Caravan deleted successfully" });
        }
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Delete caravan Error", error: error.message });
    }
  }
);

/* SEARCH FOR AVAILABLE CARAVANS */
router.get("/searchbydate/:start/:end", async (req, res) => {
  try {
    const start = req.params.start;
    const end = req.params.end;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const availableCaravans = await caravanService.searchAvailabilityByDate(
      start,
      end,
      page,
      limit
    );
    console.log("available caravans", availableCaravans.availableCaravans);
    return res.status(200).json({ caravans: availableCaravans });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Search caravans Error", error: error.message });
  }
});

module.exports = router;
