var express = require("express");
const { reviewService } = require("../models/serviceIndex");
const Caravan = require("../models/caravans/caravanModel");
const router = express.Router();
const chalk = require("chalk");

router.post("/create", async (req, res) => {
  try {
    const newReview = await reviewService.createReview(req.body);
    res.status(201).json({ message: "Review created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Create review Error", error: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const reviews = await reviewService.getAllReviews();
    res.status(200).json({ message: "All reviews", reviews: reviews });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Get All Reviews Err", error: error.message });
  }
});

router.get("/:reviewId", async (req, res) => {
  try {
    const foundReview = await reviewService.getReviewById(req.params.reviewId);
    if (!foundReview || foundReview.length === 0) {
      res.status(400).json("No review Found");
    } else {
      res.status(200).send({ found_review: foundReview });
    }
  } catch (err) {
    res
      .status(400)
      .json({ message: "Find review by is error", error: err.message });
  }
});

router.put("/:reviewId", async (req, res) => {
  try {
    const foundReview = await reviewService.getReviewById(req.params.reviewId);
    if (!foundReview || foundReview.length === 0) {
      res.status(400).json("No review Found");
    } else {
      const updatedReview = await reviewService.updateReview(
        req.params.reviewId,
        req.body
      );
      res.status(200).json({
        message: "Review updated successfully",
        updated_review: updatedReview,
      });
    }
  } catch (err) {
    res
      .status(400)
      .json({ message: "Update review by is error", error: err.message });
  }
});

router.delete("/:reviewId", async (req, res) => {
  try {
    const foundReview = await reviewService.getReviewById(req.params.reviewId);
    if (!foundReview || foundReview.length === 0) {
      res.status(400).json("No review Found");
    } else {
      const deletedReview = await reviewService.deleteReview(
        req.params.reviewId
      );
      res.status(200).json({
        message: "Review deleted successfully",
      });
    }
  } catch (err) {
    res
      .status(400)
      .json({ message: "Delete review by is error", error: err.message });
  }
});

module.exports = router;
