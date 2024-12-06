const Review = require("./reviewModel");

const createReview = (reviewInput) => {
  const review = new Review(reviewInput);
  return review.save();
};

const getReviewById = (reviewId) => {
  return Review.findOne({ _id: reviewId });
};

const getAllReviews = () => {
  return Review.find();
};

const updateReview = (reviewId, updatedReview) => {
  return Review.findByIdAndUpdate(reviewId, updatedReview, {
    new: true,
  });
};

const deleteReview = (reviewId) => {
  return Review.deleteOne({ _id: reviewId });
};

module.exports = {
  createReview,
  getReviewById,
  getAllReviews,
  updateReview,
  deleteReview,
};
