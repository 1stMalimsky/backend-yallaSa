var express = require("express");
const {
  userService,
  caravanService,
  reservationService,
  reviewService,
} = require("../models/serviceIndex");
const Caravan = require("../models/caravans/caravanModel");
const router = express.Router();
const chalk = require("chalk");

/* CREATE CARAVAN */

router.post("/create", async (req, res) => {
  try {
    const newCaravan = await caravanService.createCaravan(req.body);
    res.status(201).json({ message: "Caravan created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Create caravan Error", error: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const caravans = await caravanService.getAllCaravans();
    res.status(200).json({ message: "All caravans", caravans: caravans });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Get All Caravans Err", error: error.message });
  }
});

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

router.put("/:caravanId", async (req, res) => {
  try {
    const foundCaravan = await caravanService.getCaravanById(
      req.params.caravanId
    );
    if (!foundCaravan || foundCaravan.length === 0) {
      res.status(400).json("No caravan Found");
    } else {
      const updatedCaravan = await caravanService.updateCaravan(
        req.params.caravanId,
        req.body
      );
      res.status(200).json({ message: "Caravan updated successfully" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Update caravan Error", error: error.message });
  }
});

router.delete("/:caravanId", async (req, res) => {
  try {
    const foundCaravan = await caravanService.getCaravanById(
      req.params.caravanId
    );
    if (!foundCaravan || foundCaravan.length === 0) {
      res.status(400).json("No caravan Found");
    } else {
      await caravanService.deleteCaravan(req.params.caravanId);
      res.status(200).json({ message: "Caravan deleted successfully" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Delete caravan Error", error: error.message });
  }
});

module.exports = router;
