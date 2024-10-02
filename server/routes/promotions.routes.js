const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const promotionController = require("../controllers/promotion.controller");
const { isAdmin, verifyToken } = require("../middleware/authJwt");

router.post(
  "/add",
  [verifyToken, isAdmin],
  asyncHandler(promotionController.createPromotion)
);
router.post(
  "/shop/add",
  [verifyToken],
  asyncHandler(promotionController.createPromotionByShop)
);
router.get("/", asyncHandler(promotionController.getAllPromotions));
router.get(
  "/shop/:id",
  asyncHandler(promotionController.getAllPromotionsByShop)
);
router.post(
  "/apply-promotion/:id",
  asyncHandler(promotionController.applyPromotion)
);

module.exports = router;
