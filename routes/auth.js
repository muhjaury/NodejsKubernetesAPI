const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Login
router.post("/login", async (req, res) => {
  //Checking Username
  const user = await User.findOne({ username: req.body.username });
  if (!user)
    return res.status(401).json({
      status: res.statusCode,
      message: "Username doesn't exist",
    });

  //Checking Password
  const pwd = await bcrypt.compare(req.body.password, user.password);
  if (!pwd)
    return res.status(401).json({
      status: res.statusCode,
      message: "Wrong Password",
    });

  //res.send("Username and Password is correct");

  //JWT
  if (user.role == "User") {
    const token = jwt.sign({ username: user.username }, process.env.KEY, {
      expiresIn: "59s",
    });
    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.REFRESH_KEY,
      {
        expiresIn: "1y",
      }
    );
    res.json({ token: token, refreshToken: refreshToken });
  } else {
    res.json({ statusCode: 200, message: "Welcome Admin" });
  }
});

module.exports = router;
