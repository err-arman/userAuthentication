const { User } = require("../model/User");
const jwt = require("jsonwebtoken");
const authenticate = async (req, res, next) => {
  let token = req.headers.authorization;

  try {
    if (!token) {
      return res.json({
        message: "Token Not Found.",
      });
    }
    token = token.split(" ")[1];
    console.log(token.length);
    if (token.length < 50) {
      return res.json({
        message: "Invalid Token.",
      });
    }
    const userDataDecoded = jwt.decode(token, process.env.jwtSecretKey);
    const user = await User.findOne({ _id: userDataDecoded._id });
    if (!user) {
      return res.json({
        message: `User doesn't exist.`,
      });
    }
    delete user._doc.password;
    req.user = user;
    next();
  } catch (e) {
    console.log("AuthenTication Error", e);
  }
};

module.exports = { authenticate };
