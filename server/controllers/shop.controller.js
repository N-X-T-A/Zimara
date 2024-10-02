"use strict";

const { db } = require("../config/firebase.config");
const { BadRequestError } = require("../core/error.response");
const { CREATED, DELETED, OK } = require("../core/success.response");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

class ShopController {
  createShop = async (req, res) => {
    const { shop_name, shop_description, shop_address } = req.body;
    const owner_id = req.user.user_id;

    const existingShopSnapshot = await db
      .collection("shops")
      .where("owner_id", "==", owner_id)
      .get();

    if (!existingShopSnapshot.empty) {
      return new BadRequestError({
        message: "Bạn đã có một cửa hàng.",
      }).send(res);
    }
    const currentDate = dayjs();

    const newShopRef = db.collection("shops").doc();
    const newShop = {
      shop_id: newShopRef.id,
      shop_name,
      owner_id,
      shop_description,
      shop_address,
      is_mall: false,
      join_time: currentDate.toISOString().split(".")[0],
      responseRate: 100,
      followers: 0,
      rating: 0,
    };

    await newShopRef.set(newShop);

    return new CREATED({
      message: "Tạo cửa hàng thành công!",
      metadata: newShop,
    }).send(res);
  };
  deleteShop = async (req, res) => {
    const ShopId = req.params.id;
    const shopRef = db.collection("shops").doc(ShopId);
    const shopDoc = await shopRef.get();

    if (!shopDoc.exists) {
      return res.status(404).json({ message: "Cửa hàng này không tồn tại" });
    }

    await shopRef.delete();

    return new DELETED({
      message: "Cửa hàng đã được xóa thành công!",
    }).send(res);
  };
  getProduct = async (req, res, next) => {
    try {
      const productSnapshot = await db
        .collection("products")
        .where("shop_id", "==", req.params.id)
        .get();

      if (productSnapshot.empty) {
        return res.status(403).json({ message: "Không có sản phẩm nào" });
      }
      const products = productSnapshot.docs.map((doc) => {
        const productData = doc.data();
        return {
          id: doc.id,
          name: productData.name,
          sale_price: productData.sale_price,
          product_images:
            productData.product_images.length > 0
              ? productData.product_images[0]
              : null,
        };
      });

      new OK({
        message: "Lấy sản phẩm thành công",
        metadata: products,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  getInfo = async (req, res, next) => {
    try {
      const owner_id = req.user.user_id;
      const shopSnapshot = await db
        .collection("shops")
        .where("owner_id", "==", owner_id)
        .get();

      if (shopSnapshot.empty) {
        return res.status(404).json({ message: "Cửa hàng không tồn tại" });
      }

      const shopData = shopSnapshot.docs[0].data();

      shopData.is_mall = undefined;
      shopData.owner_id = undefined;

      return new OK({
        message: "Lấy thông tin cửa hàng thành công",
        metadata: shopData,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  UpdateInfo = async (req, res) => {
    try {
      const owner_id = req.user.user_id;
      const { shop_name, shop_description, shop_address } = req.body;

      const shopSnapshot = await db
        .collection("shops")
        .where("owner_id", "==", owner_id)
        .get();

      if (shopSnapshot.empty) {
        return res.status(404).json({ message: "Cửa hàng không tồn tại" });
      }

      const shopRef = shopSnapshot.docs[0].ref;

      await shopRef.update({
        shop_name,
        shop_description,
        shop_address,
      });

      return new OK({
        message: "Cập nhật thông tin cửa hàng thành công!",
      }).send(res);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi cập nhật cửa hàng", error });
    }
  };
}

module.exports = new ShopController();
