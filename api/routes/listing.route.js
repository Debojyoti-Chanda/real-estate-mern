const express = require("express");
const listController = require("../controller/listing.controller");
const { verifyToken } = require("../utils/verifyUser");

const router = express.Router();

router.post("/create", verifyToken, listController.postCreateListing);

module.exports = router;