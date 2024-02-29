const express = require("express");

const authController = require("../controller/auth.controller")

const router = express.Router();

router.post('/signup', authController.postSignup);

router.post('/login', authController.postLogin);

router.post('/google', authController.postGoogle);

module.exports = router;