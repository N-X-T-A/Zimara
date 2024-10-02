"use strict";

const express = require("express");
const asyncHandler = require("express-async-handler");

const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const { verifySignUp } = require("../middleware");

router.post(
  "/signup",
  [verifySignUp.checkDuplicateEmail, verifySignUp.checkDuplicatePhoneNumber],
  asyncHandler(AuthController.signUp)
);
router.post("/login", asyncHandler(AuthController.login));
router.post("/google", asyncHandler(AuthController.google));
router.post("/facebook", asyncHandler(AuthController.facebook));

module.exports = router;
