const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = verifyToken;

function verifyToken(roles) {
  return [
    async (req, res, next) => {
      //Header
      const token = req.header("key");
      const username = req.header("username");

      //Checking Username
      if (!username)
        return res.status(400).json({
          status: res.statusCode,
          message: "Username Empty",
        });

      //Checking Token
      if (!token)
        return res.status(400).json({
          status: res.statusCode,
          message: "Key Empty",
        });

      //Checking Roles
      if (roles) {
        const user = await User.findOne({ username: username, role: roles });
        console.log(user);
        if (!user)
          return res.status(400).json({
            status: res.statusCode,
            message: "Unauthorized",
          });
      }

      try {
        const verified = jwt.verify(token, process.env.KEY);
        req.user = verified;
        next();
      } catch (err) {
        res.status(400).json({
          status: res.statusCode,
          message: "Invalid Token",
        });
      }
    },
  ];
}
