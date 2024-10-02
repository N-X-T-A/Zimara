"use strict";

const express = require("express");
const asyncHandler = require("express-async-handler");
const { verifyToken } = require("../middleware/authJwt");
const classificationController = require("../controllers/classification.controller");

const router = express.Router();

router.post(
  "/add/:id",
  verifyToken,
  asyncHandler(classificationController.create)
);

module.exports = router;
