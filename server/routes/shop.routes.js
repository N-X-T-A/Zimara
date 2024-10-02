"use strict";

const express = require("express");
const asyncHandler = require("express-async-handler");
const shopController = require("../controllers/shop.controller");
const { verifyToken, isAdmin } = require("../middleware/authJwt");

const router = express.Router();

router.get("/product/:id", asyncHandler(shopController.getProduct));
router.get("/info", verifyToken, asyncHandler(shopController.getInfo));
router.put("/update", verifyToken, asyncHandler(shopController.UpdateInfo));
router.post("/create", verifyToken, asyncHandler(shopController.createShop));
router.delete(
  "/delete/:id",
  [verifyToken, isAdmin],
  asyncHandler(shopController.deleteShop)
);

module.exports = router;
