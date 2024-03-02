const listingModel = require("../models/listing.model");
const { errorHandler } = require("../utils/error");

module.exports.postCreateListing = (req, res, next) => {
  const newListing = new listingModel({ ...req.body });
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
  listingModel
    .find({ userId: req.userId })
    .then((lists) => {
      res.status(200).json(lists);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteListing = (req, res, next) => {
  listingModel
    .findByIdAndDelete(req.params.id)
    .then((response) => {
      if (!response) return next(errorHandler(404, 'Listing Not Found...'));
      if (req.userId !== response.userId.toString()) return next(errorHandler(401, "You can only delete your own listing"));
      res.status(200).json({ message: "List has been deleted..." , data : response});
    })
    .catch((err) => next(err));
};
