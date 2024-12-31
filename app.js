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
createInitialData();

app.use(logger("dev"));
app.use(express.json());

/*  Placeholder route for testing*/

app.get("/", (req, res) => {
  res.send("server is running");
});
app.use("/api", apiRouter);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  next();
});
app.use(express.json({ limit: "50mb" })); // For JSON payloads
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

// catch 404 and forward to error handler
app.use(function (err, req, res, next) {
  console.log("404 error here");
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
