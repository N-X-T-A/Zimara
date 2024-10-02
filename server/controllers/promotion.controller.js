"use strict";

const { db } = require("../config/firebase.config");
const { BadRequestError } = require("../core/error.response");
const { CREATED, OK } = require("../core/success.response");
const dayjs = require("dayjs");
const { nanoid } = require("nanoid");

const id = nanoid(6);

class PromotionalProgramController {
  createPromotion = async (req, res) => {
    const {
      description,
      amount,
      type,
      discount_percentage,
      expired,
      limitation,
      quantity,
    } = req.body;

    const promotionRef = db.collection("promotional_programs").doc();

    const image =
      type === "shipping"
        ? "/public/images/shipping"
        : "/public/images/percent";

    const newPromotion = {
      pp_id: promotionRef.id,
      code: id,
      description,
      image,
      amount,
      type,
      discount_percentage,
      start_at: dayjs().toISOString().split(".")[0],
      expired: dayjs(expired).toISOString().split(".")[0],
      limitation,
      quantity,
    };

    await promotionRef.set(newPromotion);

    return new CREATED({
      message: "Tạo mã giảm giá thành công!",
      metadata: newPromotion,
    }).send(res);
  };

  createPromotionByShop = async (req, res) => {
    const {
      description,
      amount,
      discount_percentage,
      expired,
      limitation,
      quantity,
    } = req.body;

    const promotionRef = db.collection("promotional_programs_shop").doc();

    const shopSnapShot = await db
      .collection("shops")
      .where("owner_id", "==", req.user.user_id)
      .get();

    if (shopSnapShot.empty) {
      return res.status(404).json({ message: "Cửa hàng không tồn tại" });
    }

    const shopDoc = shopSnapShot.docs[0];
    const shopData = shopDoc.data();

    const newPromotion = {
      pp_id: promotionRef.id,
      shop_id: shopDoc.id,
      code: id,
      description,
      image: shopData.image,
      amount,
      discount_percentage,
      start_at: dayjs().toISOString().split(".")[0],
      expired: dayjs(expired).toISOString().split(".")[0],
      limitation,
      quantity,
    };

    await promotionRef.set(newPromotion);

    return new CREATED({
      message: "Tạo mã giảm giá thành công!",
      metadata: newPromotion,
    }).send(res);
  };

  applyPromotion = async (req, res) => {
    const code = req.params.id;

    const promotionSnapshot = await db
      .collection("promotional_programs")
      .where("code", "==", code)
      .get();

    if (promotionSnapshot.empty) {
      return new BadRequestError({
        message: "Mã giảm giá không hợp lệ hoặc đã hết hạn.",
      }).send(res);
    }

    const promotionDoc = promotionSnapshot.docs[0];
    const promotion = promotionDoc.data();

    if (promotion.quantity <= 0) {
      return new BadRequestError({
        message: "Mã giảm giá đã hết số lượng.",
      }).send(res);
    }

    await promotionDoc.ref.update({
      quantity: promotion.quantity - 1,
    });

    const promotions = {
      discount_percentage: promotion.discount_percentage,
    };

    return new OK({
      message: "Áp dụng mã giảm giá thành công!",
      metadata: promotions,
    }).send(res);
  };

  getAllPromotions = async (req, res) => {
    const currentDate = dayjs().toISOString().split(".")[0];
    const promotionsSnapshot = await db
      .collection("promotional_programs")
      .get();

    const batch = db.batch();
    const promotions = [];

    promotionsSnapshot.forEach((doc) => {
      const promotion = doc.data();
      promotions.push({ id: doc.id, ...promotion });

      if (promotion.expired < currentDate || promotion.quantity <= 0) {
        batch.delete(doc.ref);
      }
    });

    await batch.commit();

    return new OK({
      message: "Lấy mã giảm giá thành công!",
      metadata: promotions.filter(
        (p) => p.expired >= currentDate || p.quantity <= 0
      ),
    }).send(res);
  };

  getAllPromotionsByShop = async (req, res) => {
    const currentDate = dayjs().toISOString().split(".")[0];
    const promotionsSnapshot = await db
      .collection("promotional_programs_shop")
      .get();

    const batch = db.batch();
    const promotions = [];

    promotionsSnapshot.forEach((doc) => {
      const promotion = doc.data();
      if (promotion.shop_id === req.params.id) {
        promotions.push({ id: doc.id, ...promotion });
      }

      if (promotion.expired < currentDate || promotion.quantity <= 0) {
        batch.delete(doc.ref);
      }
    });

    await batch.commit();

    return new OK({
      message: "Lấy mã giảm giá thành công!",
      metadata: promotions.filter(
        (p) => p.expired >= currentDate || p.quantity <= 0
      ),
    }).send(res);
  };
}

module.exports = new PromotionalProgramController();
