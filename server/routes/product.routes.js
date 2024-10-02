"use strict";

const express = require("express");
const asyncHandler = require("express-async-handler");
const productController = require("../controllers/product.controller");
const { verifyToken } = require("../middleware/authJwt");

const router = express.Router();
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
});

router.get("/", asyncHandler(productController.getProduct));

router.get("/:id", asyncHandler(productController.getProductById));
router.get("/category/:id", asyncHandler(productController.getProductCategory));

router.post(
  "/add",
  [verifyToken],
  upload.array("product_images"),
  asyncHandler(productController.addProduct)
);

router.delete(
  "/remove/:productId",
  verifyToken,
  asyncHandler(productController.removeProduct)
);

router.post(
  "/add-review/:id",
  verifyToken,
  asyncHandler(productController.addReview)
);
router.post(
  "/reply-review/:id",
  verifyToken,
  asyncHandler(productController.replyReview)
);

module.exports = router;
