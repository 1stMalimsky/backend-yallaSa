var express = require("express");
const userService = require("../models/users/userService");
const hashService = require("../utils/bcrypt/hashService");
const jwtService = require("../utils/jwt/jwtService");
const User = require("../models/users/userModel");
const chalk = require("chalk");
const router = express.Router();
const { validateLoginSchema } = require("../validation/joi/loginValidation");

/* CREATE USER */

router.post("/register", async (req, res) => {
  try {
    const newUser = await userService.registerUser(req.body);

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* HASH PASSWORDS */

const changePassword = async (userArray) => {
  const newArr = await Promise.all(
    userArray.map(async (user) => {
      const plainUser = user.toObject();
      return {
        ...plainUser,
        password: await hashService.generateHash(user.password),
      };
    })
  );
  return newArr;
};

const multipleUpdate = async (usersArr) => {
  try {
    const updatedArr = await changePassword(usersArr);
    //console.log("updatedArr", updatedArr);
    for (const user of updatedArr) {
      try {
        console.log(chalk.black.bgWhite("updating user", user._id));

        await userService.updateUser(user._id, { password: user.password });
        console.log("multiple update success");
      } catch (err) {
        console.log("multiple update error", err);
      }
    }
  } catch (err) {
    console.log(chalk.red.bold("multipleUpdate err", err));
  }
};

router.put("/hashpasswords", async (req, res) => {
  try {
    const allUsers = await userService.getAllUsers();
    if (!allUsers) {
      res.status(400).json("no users found");
    }
    const newUsers = await multipleUpdate(allUsers);
    res.status(200).json({ message: "success", info: newUsers });
  } catch (err) {
    console.log(chalk.red.bold("hashPasswords error"));
    res.status(400).send("error");
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

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* UPDATE USER */
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
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
