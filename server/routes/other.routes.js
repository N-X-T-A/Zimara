"use strict";

const express = require("express");
const asyncHandler = require("express-async-handler");
const otherController = require("../controllers/other.controller");
const multer = require("multer");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/shipping-fee/:id", asyncHandler(otherController.getfee));
router.get("/client_id", asyncHandler(otherController.getClientId));

router.post(
  "/upload",
  upload.single("image"),
  asyncHandler(otherController.uploadImage)
);

module.exports = router;
