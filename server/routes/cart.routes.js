"use strict";

const express = require("express");
const asyncHandler = require("express-async-handler");
const { verifyToken } = require("../middleware/authJwt");
const cartController = require("../controllers/cart.controller");

const router = express.Router();

router.post("/", verifyToken, asyncHandler(cartController.getCart));

module.exports = router;
