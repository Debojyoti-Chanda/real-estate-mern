const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");


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
