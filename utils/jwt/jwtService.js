const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (payload, expDate = "30d") =>
  new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.jwtSecret,
      {
        expiresIn: expDate,
      },
      (err, token) => {
        if (err) reject("jwt service error", err);
        else resolve(token);
      }
    );
  });

const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.jwtSecret, (err, payload) => {
      if (err) reject(err);
      else resolve(payload);
    });
  });

module.exports = { generateToken, verifyToken };
