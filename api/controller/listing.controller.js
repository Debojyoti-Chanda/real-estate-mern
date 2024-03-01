const listingModal = require("../models/listing.model");

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
