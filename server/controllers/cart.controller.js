"use strict";

const { OK } = require("../core/success.response");
const { db } = require("../config/firebase.config");

class CartController {
  getCart = async (req, res) => {
    try {
      const { productId } = req.body;
      const productIds = Array.isArray(productId) ? productId : [productId];

      // Lấy thông tin sản phẩm và các shop_id duy nhất
      const productSnapshot = await db
        .collection("products")
        .where("product_id", "in", productIds)
        .get();

      const products = {};
      const shopIds = new Set();

      productSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        products[data.product_id] = {
          product_id: data.product_id,
          ...data,
        };
        shopIds.add(data.shop_id);
      });

      const shopSnapshot = await db
        .collection("shops")
        .where("shop_id", "in", Array.from(shopIds))
        .get();

      const shopsMap = shopSnapshot.docs.reduce((acc, doc) => {
        const { shop_id, shop_name } = doc.data();
        acc[shop_id] = { shop_id, shop_name };
        return acc;
      }, {});

      const result = Array.from(shopIds).map((shopId) => {
        const shop = shopsMap[shopId];
        const shopProducts = Object.values(products).filter(
          (p) => p.shop_id === shopId
        );
        return {
          shop_id: shop.shop_id,
          shop_name: shop.shop_name,
          products: shopProducts,
        };
      });

      new OK({
        message: "Lấy sản phẩm thành công",
        metadata: { shops: result },
      }).send(res);
    } catch (error) {
      console.error("Error getting cart:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}

module.exports = new CartController();
