const userModel = require("../models/user.model");
const { errorHandler } = require("../utils/error");
const bcrypt = require("bcryptjs");

module.exports.test = (req, res, next) => {
  res.json({ message: "Test API route is working!!" });
};

module.exports.postUpdateUser = (req, res, next) => {
  if (req.userId !== req.params.id) {
    return next(errorHandler(401, "You can only update your own Account"));
  }
  let hashedp;
  if (req.body.password) {
    hashedp = bcrypt.hashSync(req.body.password, 10);
  }
  userModel
    .findByIdAndUpdate(
      req.userId,
      {
        $set: {
          username: req.body.username,
          password: hashedp,
          email: req.body.email,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    )
    .then((user) => {
      const { password, ...rest } = user._doc;
      res.status(200).json(rest);
    })
    .catch((err) => next(err));
};
