const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = verifyToken;

function verifyToken(roles) {
  return [
    async (req, res, next) => {
      //Header
      const token = req.header("key");
      const username = req.header("username");
      const user = await User.findOne({ username: username });

      //Checking Username
      if (!username)
        return res.status(400).json({
          status: res.statusCode,
          message: "Username Empty",
        });

      if (!user)
        return res.status(400).json({
          status: res.statusCode,
          message: "Wrong Username",
        });

      if (roles) {
        console.log(user.role == roles);
        if (!(user.role == roles))
          return res.status(400).json({
            status: res.statusCode,
            message: "Unauthorized",
          });
      }

      try {
        if (user.role == "User") {
          if (!token)
            return res.status(400).json({
              status: res.statusCode,
              message: "Key Empty",
            });
          const verified = jwt.verify(token, process.env.KEY);
          req.user = verified;
        }
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
