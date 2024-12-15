const express = require("express");
const router = express.Router();

const userRouter = require("./users");
const caravanRouter = require("./caravans");
const reservationRouter = require("./reservations");
const imgUploadRouter = require("./imgUploadRoute");

router.use("/users", userRouter);
router.use("/caravans", caravanRouter);
router.use("/reservations", reservationRouter);
router.use("/reviews", require("./reviews"));
router.use("/images", imgUploadRouter);

module.exports = router;
