const listingModal = require("../models/listing.model");
const { errorHandler } = require("../utils/error");

module.exports.postCreateListing = (req, res, next) => {
  const newListing = new listingModal({ ...req.body });
  newListing
    .save()
    .then((listObj) => {
      return res.status(200).json(listObj);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getUserListings = (req, res, next) => {
  if (req.userId !== req.params.id) {
    return next(errorHandler(401, "You can only update your own Account"));
  }
  listingModal
    .find({ userId: req.userId })
    .then((lists) => {
      res.status(200).json(lists);
    })
    .catch((err) => {
      next(err);
    });
};
