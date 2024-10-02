var express = require("express");
var router = express.Router();

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "authorization, Origin, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

router.use("/auth", require("./auth.routes"));
router.use("/api/category", require("./category.routes"));
router.use("/api/shop", require("./shop.routes"));
router.use("/api/product", require("./product.routes"));
router.use("/api/order", require("./order.routes"));
router.use("/api/classification", require("./classification.routes"));
router.use("/api/user", require("./user.routes"));
router.use("/api/cart", require("./cart.routes"));
router.use("/api/promotions", require("./promotions.routes"));
router.use("/api", require("./other.routes"));

module.exports = router;
