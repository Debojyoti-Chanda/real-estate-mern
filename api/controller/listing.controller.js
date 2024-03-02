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

// userId was passed in the params to find all the lists of the user
module.exports.getUserListings = (req, res, next) => {
  if (req.userId !== req.params.id) {
    return next(errorHandler(401, "You can only update your own Account."));
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
      if (!response) return next(errorHandler(404, "Listing Not Found..."));
      if (req.userId !== response.userId.toString())
        return next(errorHandler(401, "You can only delete your own listing"));
      res
        .status(200)
        .json({ message: "List has been deleted...", data: response });
    })
    .catch((err) => next(err));
};

module.exports.postEditList = (req, res, next) => {
  listingModel
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((response) => {
      if (!response) return next(errorHandler(404, "Listing Not Found..."));
      if (req.userId !== response.userId.toString())
        return next(errorHandler(401, "You can only delete your own listing"));
      res.status(200).json({ ...response });
    })
    .catch((err) => next(err));
};

// listId was passed in the params to find the specific list with the id
module.exports.getList = (req, res, next) => {
  listingModel
    .findById({ _id: req.params.id })
    .then((list) => {
      if (!list) return next(errorHandler(404, "List Not Found..."));
      res.status(200).json(list);
    })
    .catch((err) => next(err));
};
