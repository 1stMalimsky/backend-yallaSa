var express = require("express");
const userService = require("../models/users/userService");
const hashService = require("../utils/bcrypt/hashService");
const jwtService = require("../utils/jwt/jwtService");
const User = require("../models/users/userModel");
const chalk = require("chalk");
const router = express.Router();
const { validateLoginSchema } = require("../validation/joi/loginValidation");
const normalizeUser = require("../utils/normalize/normalizeUser");
const { validateUser } = require("../validation/joi/registerUserValidation");
const { loggedInCheck } = require("./helpers/middleware");

/* CREATE USER */

router.post("/register", async (req, res) => {
  try {
    console.log("req.body", req.body);

    const joiResponse = validateUser(req.body);
    if (joiResponse && joiResponse.error) {
      console.log("Register joiRespone", joiResponse.error);
      return res
        .status(400)
        .json({ message: joiResponse.error.message || err });
    }
    const userEmail = await userService.getUserByEmail(req.body.email);
    if (userEmail) {
      return res
        .status(400)
        .json({ message: "כתובת מייל קיימת. אנא הרשם עם כתובת אחרת" });
    }
    const normalizedUser = await normalizeUser(req.body);
    console.log("normalizedUser", normalizedUser);

    const newUser = await userService.registerUser(normalizedUser);
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/*  LOGIN */
router.post("/login", async (req, res) => {
  try {
    const joiResponse = validateLoginSchema(req.body);
    if (joiResponse && joiResponse.error) {
      console.log("מייל או סיסמא לא תקינים", joiResponse.error);
      res.status(400).json({ message: "מייל א וסיסמא לא תקינים" });
      return;
    }
    const currentUser = await userService.getUserByEmail(req.body.email);
    if (!currentUser) {
      res.status(500).json("המשתמש לא קיים");
      return;
    }
    console.log("req.body", req.body, "currentUser", currentUser);

    const validatePassword = await hashService.compareHash(
      req.body.password,
      currentUser.password
    );
    console.log("validatePassword", validatePassword);

    if (!validatePassword) {
      res.status(400).json("מייל או סיסמא לא תקינים");
      return;
    }
    const token = await jwtService.generateToken({
      userId: currentUser._id,
      isAdmin: currentUser.isAdmin,
      isOwner: currentUser.isOwner,
      isBusiness: currentUser.isBusiness,
    });
    res.json({ token: token });
  } catch (err) {
    res.status(400).json({ message: "loginError", error: err.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: `here!!! ${error.message}` });
  }
});

/* GET USER BY ID */
router.get("/:id", async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    console.log("userDetails", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* UPDATE USER */
router.put("/update/:id", loggedInCheck, async (req, res) => {
  if (req.tokenPayload.userId !== req.params.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const foundUser = await userService.getUserById(req.params.id);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let token = "";
    if (
      foundUser.isAdmin !== req.body.isAdmin ||
      foundUser.isOwner !== req.body.isOwner ||
      foundUser.isBusiness !== req.body.isBusiness
    ) {
      token = await jwtService.generateToken({
        userId: req.tokenPayload.userId,
        isAdmin: req.body.isAdmin,
        isOwner: req.body.isOwner,
        isBusiness: req.body.isBusiness,
      });
      console.log("new token created");
    }

    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
      token: token || "",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* DELETE USER */

router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
