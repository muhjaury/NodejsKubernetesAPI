const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = verifyRefreshToken;

function verifyRefreshToken() {
  return [
    async (req, res, next) => {
      //Header
      const username = req.header("username");
      const refreshToken = req.header("refresh-key");

      //Checking Username
      if (!username)
        return res.status(400).json({
          status: res.statusCode,
          message: "Username Empty",
        });

      //Checking Token
      if (!refreshToken)
        return res.status(400).json({
          status: res.statusCode,
          message: "Key Empty",
        });

      try {
        const verified = jwt.verify(refreshToken, process.env.REFRESH_KEY);
        req.user = verified;
        next();
      } catch (err) {
        res.status(400).json({
          status: res.statusCode,
          message: "Invalid Refresh Token",
        });
      }
    },
  ];
}
