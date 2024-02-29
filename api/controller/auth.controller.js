const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { errorHandler } = require("../utils/error");
const jwt = require("jsonwebtoken");

module.exports.postSignup = (req, res, next) => {
  const { username, email, password } = req.body;
  return bcrypt
    .hash(password, 12)
    .then((hashp) => {
      const newUser = new userModel({ username, email, password: hashp });
      return newUser.save();
    })
    .then((usrObj) => {
      res.status(201).json({ message: "Welcome!!" });
    })
    .catch((err) => {
      //   res.status(500).json({ message: "Error during saving user" , error : err.message});
      next(err);
    });
};

module.exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  userModel
    .findOne({ email })
    .then((userObj) => {
      if (!userObj) {
        console.log("User dosnt exist");
        throw errorHandler(404, "User Not Found");
      }
      //User exists
      bcrypt.compare(password, userObj.password).then((boolVal) => {
        if (boolVal === false) {
          next(errorHandler(401, "Invalid Password"));
          return;
        }
        const token = jwt.sign({ userId: userObj._id }, process.env.JWT_SECRET);
        const { password, ...details } = userObj._doc;
        res
          .cookie("access_token", token, { httpOnly: true })
          .status(200)
          .json(details);
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.postGoogle = (req, res, next) => {
  const {email, photo} = req.body;
  userModel
    .findOne({ email })
    .then((userObj) => {
      //User exists
      if (userObj) {
        const token = jwt.sign({ userId: userObj._id }, process.env.JWT_SECRET);
        const { password, ...details } = userObj._doc;
        res
          .cookie("access_token", token, { httpOnly: true })
          .status(200)
          .json(details);
      } else {
        // User does not exist
        const username = req.body.username.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4);
        // console.log(username);
        const generatedPassword = Math.random().toString(36).slice(-8);
        // console.log(generatedPassword);
        bcrypt
          .hash(generatedPassword, 10)
          .then((hashedP) => {
            const newUser = new userModel({ username, email, password: hashedP ,avatar: photo});
            return newUser.save();
          }).then(newUsr => {
            const token = jwt.sign({ userId: newUsr._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUsr._doc;
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
          }).catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      next(err);
    });
};
