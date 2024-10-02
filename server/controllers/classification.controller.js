"use strict";

const { db } = require("../config/firebase.config");
const { CREATED, OK } = require("../core/success.response");

class ClassificationController {
  create = async (req, res) => {
    const productId = req.params.id;
    const { types } = req.body;

    const productDoc = await db.collection("products").doc(productId).get();

    if (!productDoc.exists) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    const productData = productDoc.data();
    const shopSnapshot = await db
      .collection("shops")
      .where("owner_id", "==", req.user.user_id)
      .get();

    if (shopSnapshot.empty || shopSnapshot.docs[0].id !== productData.shop_id) {
      return res.status(403).json({ message: "Bạn không có quyền thêm" });
    }

    const newClassificationRef = db.collection("classification").doc();
    const newClassification = {
      product_id: productId,
      color_options: types || [],
    };

    await newClassificationRef.set(newClassification);

    return new CREATED({
      message: "Thêm thành công!",
      metadata: newClassification,
    }).send(res);
  };
}

module.exports = new ClassificationController();
