"use strict";

const { OK } = require("../core/success.response");
const { db } = require("../config/firebase.config");

class CategoryController {
  getAllCategory = async (req, res, next) => {
    try {
      const categorySnapshot = await db.collection("categories").get();

      const categories = categorySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      new OK({
        message: "Lấy toàn bộ danh mục thành công",
        metadata: categories,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new CategoryController();
