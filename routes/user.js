const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("./token");
const verifyRefreshToken = require("./refreshToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const role = ["Admin", "User"];

//Create
router.post("/create", verifyToken(role[0]), async (req, res) => {
  const usernameExist = await User.findOne({ username: req.body.username });
  if (usernameExist)
    return res.status(400).json({
      status: res.statusCode,
      message: "Username already Exist",
    });

  const salt = await bcrypt.genSalt(5);
  const password = await bcrypt.hash(req.body.password, salt);
  const user = new User({
    username: req.body.username,
    password: password,
    role: req.body.role,
  });
  try {
    const saveUser = await user.save();
    res.json(saveUser);
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      message: "Register failed",
    });
  }
});

//Read
router.get("/read", verifyToken(), async (req, res) => {
  try {
    const username = req.header("username");
    const user = await User.findOne({ username: username, role: "User" });
    var book = "";
    if (!user) {
      result = await User.find();
    } else {
      result = await User.find({ username: username });
    }

    res.json(result);
  } catch (err) {
    res.json({ message: err });
  }
});

//Update
router.patch("/update/:id", verifyToken(role[0]), async (req, res) => {
  try {
    const checkingUser = await User.findOne({ _id: req.params.id });
    if (!checkingUser)
      return res.status(401).json({
        status: res.statusCode,
        message: "ID Doesn't Exist",
      });
    const salt = await bcrypt.genSalt(5);
    const password = await bcrypt.hash(req.body.password, salt);
    if (!req.body.username)
      return res.status(400).json({
        status: res.statusCode,
        message: "Please enter New Username",
      });
    if (!req.body.password)
      return res.status(400).json({
        status: res.statusCode,
        message: "Please enter New Password",
      });
    await User.updateOne(
      { _id: req.params.id },
      {
        username: req.body.username,
        password: password,
      }
    );
    res.json({
      statusCode: 200,
      message: "Update Success",
      "New Username": req.body.username,
      "New Password": req.body.password,
      "Encrypted Password": password,
    });
  } catch (err) {
    res.json({ statusCode: 401, message: "Invalid Id" });
  }
});

//Delete
router.delete("/delete/:id", verifyToken(role[0]), async (req, res) => {
  try {
    const checkingUser = await User.findOne({ _id: req.params.id });
    if (!checkingUser)
      return res.status(401).json({
        status: res.statusCode,
        message: "ID Doesn't Exist",
      });
    await User.deleteOne({ _id: req.params.id });
    res.json({
      statusCode: 200,
      message: "Delete Success",
    });
  } catch (err) {
    res.json({ statusCode: 401, message: "Invalid Id" });
  }
});

//Generate Token
router.post("/generate", verifyRefreshToken(), async (req, res) => {
  const username = req.header("username");
  //JWT
  const token = jwt.sign({ username: username }, process.env.KEY, {
    expiresIn: "59s",
  });
  res.json({ token: token });
});

module.exports = router;
