"use strict";

const express = require("express");
const asyncHandler = require("express-async-handler");
const { verifyToken } = require("../middleware/authJwt");
const orderController = require("../controllers/order.controller");

const router = express.Router();

router.get("/", verifyToken, asyncHandler(orderController.getOrder));
router.post("/create", verifyToken, asyncHandler(orderController.createOrder));
router.put(
  "/update-status/:order_id",
  verifyToken,
  asyncHandler(orderController.updateOrderStatus)
);

module.exports = router;
