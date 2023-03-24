const { User } = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const rootRoute = (req, res) => {
  res.json({
    message: "this is root route",
  });
};

const signup = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    if (!name || !email || !password || !address) {
      return res.json({
        message: `required name, email, password and address.`,
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.json({
        message: "User already Exist.",
      });
    }

    user = new User({
      name,
      email,
      password,
      address,
    });

    const genSalt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, genSalt);
    user.password = hashPassword;
    await user.save();
    res.json({
      message: "User SuccessFully Created",
    });
  } catch (e) {
    res.json({
      Error: e,
    });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: `please check you email or password`,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        message: "please check your email or password",
      });
    }

    const token = jwt.sign(user._doc, process.env.jwtSecretKey);
    console.log("token", token);
    return res.json({
      message: "Log in SuccessFully.",
      token,
    });
  } catch (e) {
    console.log("error in login route", e);
    res.json({
      error: e,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { user } = req;
    await User.deleteOne({ _id: user._id });
    res.json({
      message: "Deleted This User",
      user,
    });
  } catch (err) {
    console.log(err);
  }
};

const updateUserName = async (req, res) => {
  const { name } = req.body;
  const { user } = req;
  await User.findOneAndUpdate(
    { email: user.email },
    {
      $set: {
        name,
      },
    }
  );
  res.json({
    message: `User Name Successfully Updated.`,
  });
};

const userDetails = async (req, res) => {
  const { id } = req.user;
  const user = await User.findOne({ _id: id });
  if (user) {
    res.json({
      user,
    });
  } else {
    res.json({
      message: "User not exist",
    });
  }
};

const allUsers = async (req, res) => {
  let users = await User.find({});
  if (users.length < 1) {
    console.log("no user");
    return res.json({
      message: "No, User in DataBase.",
    });
  }
  users = users.map((item) => {
    delete item._doc.password;
    return item;
  });
  if (users) {
    res.json({
      users,
    });
  }
};

const notFound = (req, res) => {
  res.json({
    message: "404 not found",
  });
};

module.exports = {
  rootRoute,
  notFound,
  signup,
  signIn,
  deleteUser,
  updateUserName,
  userDetails,
  allUsers,
};
