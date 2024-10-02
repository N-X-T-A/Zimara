"use strict";

const express = require("express");
const asyncHandler = require("express-async-handler");
const { verifyToken, isAdmin } = require("../middleware/authJwt");
const userController = require("../controllers/user.controller");

const router = express.Router();

// router.get("/add", [verifyToken, isAdmin], asyncHandler());

router.get("/info", verifyToken, asyncHandler(userController.getUserInfo));
router.put("/update", verifyToken, asyncHandler(userController.updateUserInfo));

module.exports = router;
