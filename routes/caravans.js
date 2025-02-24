var express = require("express");
const { caravanService } = require("../models/serviceIndex");
const mongoose = require("mongoose");
const reservationService = require("../models/reservations/reservationService");
const router = express.Router();
const chalk = require("chalk");
const { loggedInCheck, checkCredentials } = require("./helpers/middleware");
const { normalizeCaravan } = require("../utils/normalize/normalizeCaravan");
const userService = require("../models/users/userService");
const { searchCaravanImages } = require("../models/images/imageService");
const { generateToken } = require("../utils/jwt/jwtService");

/* CREATE CARAVAN */

router.post("/create", loggedInCheck, async (req, res) => {
  try {
    console.log("tokenPayload", req.tokenPayload);

    //console.log("req.body", req.body);
    const normalizedCaravan = normalizeCaravan(req.body);
    //console.log("normalizedCaravan", normalizedCaravan);
    /* NEDD VALIDATION? */
    const newCaravan = await caravanService.createCaravan(normalizedCaravan);
    console.log("newcravanCreated", newCaravan._id);
    const updateOwner = await userService.updateUser(req.tokenPayload.userId, {
      $push: { caravanIds: newCaravan._id },
    });

    res.status(201).json({
      message: "newCaravan created",
      newCaravan: newCaravan,
    });

    //res.status(201).json({ message: "Caravan created successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Create caravan Error",
      error: error,
    });
  }
});

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

/* GET CARAVANS BY USER ID */

router.get(
  "/usercaravans/:userId",
  loggedInCheck,
  checkCredentials((needAdmin = false), (needOwner = true)),
  async (req, res) => {
    try {
      const caravans = await caravanService.getCaravanByUserId(
        req.params.userId
      );
      res.status(200).json({
        caravansByUser: caravans,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Get Caravans by User Error", error: error.message });
    }
  }
);

/* UPDATE CARAVAN */
router.patch(
  "/:caravanId",
  loggedInCheck,
  checkCredentials((needAdmin = false), (needOwner = true)),
  async (req, res) => {
    const ownerId = new mongoose.Types.ObjectId(req.tokenPayload.userId);
    console.log("req.body", req.body);
    try {
      const foundCaravan = await caravanService.getCaravanById(
        req.params.caravanId
      );
      if (!foundCaravan || foundCaravan.length === 0) {
        res.status(400).json("No caravan Found");
      } else {
        const compareIds = foundCaravan.ownerDetails.ownerId.equals(ownerId);
        //console.log("compareIds", compareIds);
        //console.log("foundCaravan", foundCaravan);
        if (!compareIds) {
          res
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
          await userService.updateUser(ownerId, {
            $pull: { caravanIds: req.params.caravanId },
          });
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

/* GET CARAVAN IMAGES */
router.get("/images/:caravanId", async (req, res) => {
  try {
    let caravanId = req.params.caravanId;
    const caravanImages = await searchCaravanImages(caravanId);
    //console.log("caravanImages", caravanImages);

    const normalizedImages = caravanImages.map((image) => {
      //console.log("normalize init", caravanImages);
      //console.log("base 64 data:", image);

      return {
        _id: image._id,
        original: `${image.path.toString("base64")}`,
        thumbnail: `${image.path.toString("base64")}`,
        filename: image.filename,
      };
    });
    //console.log("normalizedImages", normalizedImages);

    res.status(200).json({
      caravanImages: normalizedImages,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Get caravan images Error", error: error.message });
  }
});

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
