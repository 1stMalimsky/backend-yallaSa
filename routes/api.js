const express = require("express");
const router = express.Router();

const userRouter = require("./users");
const caravanRouter = require("./caravans");

router.use("/users", userRouter);
router.use("/caravans", caravanRouter);

module.exports = router;
