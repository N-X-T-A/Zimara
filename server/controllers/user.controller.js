"use strict";

const { CREATED, DELETED, OK } = require("../core/success.response");
const { db } = require("../config/firebase.config");

class UserController {
  getUserInfo = async (req, res, next) => {
    try {
      const userId = req.user.user_id;

      const userDoc = await db.collection("users").doc(userId).get();

      if (!userDoc.exists) {
        return res.status(403).json({ message: "Người dùng không tồn tại" });
      }

      const user = {
        id: userDoc.id,
        ...userDoc.data(),
      };

      user.password = undefined;

      new OK({
        message: "Lấy thông tin người dùng thành công",
        metadata: user,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  updateUserInfo = async (req, res) => {
    const userId = req.user.user_id;

    const updateData = Object.fromEntries(
      Object.entries(req.body).filter(([_, value]) => value != null)
    );

    try {
      const userRef = db.collection("users").doc(userId);

      if (Object.keys(updateData).length > 0) {
        await userRef.update(updateData);
      }

      return new OK({
        message: "Thông tin người dùng đã được cập nhật thành công!",
      }).send(res);
    } catch (error) {
      return res.status(500).json({
        message: "Đã xảy ra lỗi khi cập nhật",
        error: error.message,
      });
    }
  };
}

module.exports = new UserController();
