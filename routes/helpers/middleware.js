const jwtService = require("../../utils/jwt/jwtService");
const chalk = require("chalk");

const loggedInCheck = async (req, res, next) => {
  try {
    const token = req.headers["x-auth-token"];
    if (!token) {
      res.status(400).json("Please provide a valid token");
    }
    const tokenPayload = await jwtService.verifyToken(token);
    req.tokenPayload = tokenPayload;
    next();
  } catch (err) {
    res.status(400).json({ message: "loggedInCheck error", err });
  }
};

const checkCredentials = (needAdmin, needOwner) => {
  return async (req, res, next) => {
    try {
      if (needAdmin && req.tokenPayload.isAdmin) {
        return next();
      }
      if (needOwner && req.tokenPayload.isOwner) {
        return next();
      } else
        res
          .status(401)
          .json({ message: "you don't have the right credentials" });
    } catch (err) {
      console.log("userAuthMW response", err);
      res
        .status(400)
        .json({ message: "Error checking credentials.", error: err });
    }
  };
};

const compareUserToken = async (req, res, next) => {
  try {
    const userId = req.tokenPayload.userId;
    const userToEdit = req.body._id;
    if (!userToEdit) {
      return res.status(401).json({ message: "No user to edit" });
    }
    if (userId !== userToEdit) {
      return res
        .status(401)
        .json({ message: "You are not authorized to edit this user" });
    }
    if (userId === userToEdit) {
      next();
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  checkCredentials,
  loggedInCheck,
  compareUserToken,
};
