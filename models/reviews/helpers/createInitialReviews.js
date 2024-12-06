const Review = require("../reviewModel");
const initialReviews = require("./initialReviews.json");
const chalk = require("chalk");

const createReviews = async () => {
  try {
    const reviews = await Review.find({});
    if (reviews.length > 0) {
      console.log(chalk.blue.italic("reviews already exist"));
      return;
    }
    await Review.insertMany(initialReviews);
    console.log(chalk.green("reviews created"));
  } catch (err) {
    console.log(chalk.red.bold("create intial reviews error"), err);
  }
};

module.exports = createReviews;
