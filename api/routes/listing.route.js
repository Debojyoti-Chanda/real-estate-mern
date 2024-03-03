const express = require("express");
const listController = require("../controller/listing.controller");
const { verifyToken } = require("../utils/verifyUser");

const router = express.Router();

router.post("/create", verifyToken, listController.postCreateListing);

router.get('/listings/:id', verifyToken, listController.getUserListings);

router.delete('/delete/:id', verifyToken, listController.deleteListing);

router.post('/edit/:id', verifyToken, listController.postEditList);

router.get('/lists/:id', listController.getList);

router.get('/getLists', listController.getLists);

module.exports = router;
