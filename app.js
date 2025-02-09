var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const apiRouter = require("./routes/api");
const { createInitialData } = require("./models/initializeData");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
connectDB();
//createInitialData();

app.use(logger("dev"));

/*  Placeholder route for testing*/

app.get("/", (req, res) => {
  res.send("server is running");
});
app.use(express.json());
app.use("/api", apiRouter);

/* TEST */
app.post("/api/test", (req, res) => {
  console.log("req.body here", req.body);

  res.send({ message: req.body });
});
/* TEST */

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  next();
});
app.use(express.json({ limit: "100mb" })); // For parsing application/json
app.use(express.urlencoded({ extended: true, limit: "100mb" })); // For parsing application/x-www-form-urlencoded

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log("General 404 error here");
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status,
    },
  });
});

module.exports = app;
