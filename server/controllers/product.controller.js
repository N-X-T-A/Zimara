"use strict";

const { CREATED, DELETED, OK } = require("../core/success.response");
const { db } = require("../config/firebase.config");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
const vi = require("dayjs/locale/vi");
dayjs.extend(relativeTime);
dayjs.locale(vi);
const { uploadImages } = require("../utils/uploadImages");

class ProductController {
  addProduct = async (req, res) => {
    try {
      const {
        name,
        description,
        original_price,
        sale_price,
        category_id,
        stock_quantity,
        promotional_quantity,
        remaining_stock,
        weight,
        types,
      } = req.body;

      const productImages = req.files;
      if (!productImages || productImages.length === 0) {
        return res.status(400).json({ message: "Chưa upload ảnh sản phẩm!" });
      }

      const imageUrls = await uploadImages(productImages, "images/products");

      const parsedTypes = Array.isArray(types) ? types : JSON.parse(types);

      const shopSnapshot = await db
        .collection("shops")
        .where("owner_id", "==", req.user.user_id)
        .get();

      if (shopSnapshot.empty) {
        return res
          .status(403)
          .json({ message: "Bạn phải đăng ký cửa hàng trước" });
      }

      const shop = shopSnapshot.docs[0];
      const shop_id = shop.id;

      const newProductRef = db.collection("products").doc();
      const newProduct = {
        product_id: newProductRef.id,
        name,
        description,
        original_price,
        sale_price,
        product_images: imageUrls,
        category_id,
        stock_quantity,
        shop_id,
        promotional_quantity,
        remaining_stock,
        weight,
        types: parsedTypes,
        average_rating: 0,
        evaluate: 0,
      };

      await newProductRef.set(newProduct);

      return new CREATED({
        message: "Sản phẩm đã được thêm thành công!",
        metadata: newProduct,
      }).send(res);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Đã xảy ra lỗi", error: error.message });
    }
  };
  removeProduct = async (req, res) => {
    try {
      const { productId } = req.params;
      const productRef = db.collection("products").doc(productId);
      const productDoc = await productRef.get();

      if (!productDoc.exists) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }

      const productData = productDoc.data();

      const shopSnapshot = await db
        .collection("shops")
        .where("owner_id", "==", req.user.user_id)
        .get();

      if (
        shopSnapshot.empty ||
        shopSnapshot.docs[0].id !== productData.shop_id
      ) {
        return res
          .status(403)
          .json({ message: "Bạn không có quyền xóa sản phẩm này" });
      }

      await productRef.delete();

      return new DELETED({
        message: "Sản phẩm đã được xóa thành công!",
      }).send(res);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Đã xảy ra lỗi", error: error.message });
    }
  };
  getProduct = async (req, res, next) => {
    try {
      const productSnapshot = await db.collection("products").get();

      const products = productSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          sale_price: data.sale_price,
          selling: data.selling,
          product_images:
            data.product_images.length > 0 ? data.product_images[0] : null,
        };
      });

      new OK({
        message: "Lấy toàn bộ sản phẩm thành công",
        metadata: products,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  getProductById = async (req, res, next) => {
    try {
      const productId = req.params.id;

      const productDoc = await db.collection("products").doc(productId).get();

      if (!productDoc.exists) {
        return res.status(403).json({ message: "Không có sản phẩm nào" });
      }

      const productSnapshot = await db
        .collection("products")
        .where("product_id", "==", productId)
        .get();

      const doc = productSnapshot.docs[0];
      const data = doc.data();
      const shopId = data.shop_id;

      const shopSnapshot = await db
        .collection("shops")
        .where("shop_id", "==", shopId)
        .get();

      if (shopSnapshot.empty) {
        return res.status(404).json({ message: "Cửa hàng không tồn tại" });
      }

      const shopData = shopSnapshot.docs[0].data();

      const registrationDate = dayjs(shopData.join_time);
      const currentDate = dayjs();
      const timeAgo = registrationDate.from(currentDate);

      const productlength = await db
        .collection("products")
        .where("shop_id", "==", shopId)
        .get();

      const shop = {
        id: shopSnapshot.docs[0].id,
        shop_name: shopData.shop_name,
        shop_image: shopData.image,
        join_time: timeAgo,
        is_mall: shopData.is_mall,
        // responseRate: shopData.responseRate,
        // followers: shopData.followers,
        // rating: shopData.rating,
        responseRate: 100,
        followers: 2000,
        rating: 5,
        products: productlength.docs.length,
        shipping_from: shopData.shop_address,
      };

      const classificationsSnapshot = await db
        .collection("classification")
        .where("product_id", "==", productId)
        .get();
      let classificationData = {};
      if (!classificationsSnapshot.empty) {
        classificationData = classificationsSnapshot.docs[0].data();
      }
      const reviewsSnapshot = await db
        .collection("reviews")
        .where("product_id", "==", productId)
        .get();

      const reviewsData = reviewsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          commend: data.commend,
        };
      });

      const totalRatings = reviewsData.reduce((sum, review) => {
        return sum + Number(review.commend.user.rating);
      }, 0);
      const averageRating =
        reviewsData.length > 0 ? totalRatings / reviewsData.length : 0;

      const commendCount = reviewsData.length;
      const productRef = await db.collection("products").doc(productId);

      await productRef.update({
        evaluate: commendCount,
        average_rating: averageRating,
      });

      const product = {
        id: productDoc.id,
        shop,
        ...productDoc.data(),
        commends: reviewsData,
      };

      product.shop_id = undefined;

      new OK({
        message: "Lấy sản phẩm thành công",
        metadata: product,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  getProductCategory = async (req, res, next) => {
    try {
      const productSnapshot = await db
        .collection("products")
        .where("category_id", "==", req.params.id)
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

  /////
  addReview = async (req, res) => {
    try {
      const productId = req.params.id;
      const userId = req.user.user_id;
      const { content, images, rating } = req.body;

      const userSnapShot = await db.collection("users").doc(userId).get();
      const userData = userSnapShot.data();

      const user = {
        id: userId,
        name: userData.username,
        photo_url: userData.photo_url,
        rating,
        content,
        images,
      };

      const shop = {};

      const commend = {
        user,
        seller: shop,
      };

      const newReviewRef = db.collection("reviews").doc();
      const newReview = {
        review_id: newReviewRef.id,
        product_id: productId,
        commend: commend,
      };

      await newReviewRef.set(newReview);

      return new CREATED({
        message: "Thêm đánh giá sản phẩm thành công!",
        metadata: newReview,
      }).send(res);
    } catch (error) {
      console.error("Error getting reviews:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  replyReview = async (req, res) => {
    try {
      const reviewId = req.params.id;
      const userId = req.user.user_id;
      const { seller_feedback } = req.body;

      const shopSnapshot = await db
        .collection("shops")
        .where("owner_id", "==", userId)
        .get();

      if (shopSnapshot.empty) {
        return res
          .status(403)
          .json({ message: "Bạn phải đăng ký cửa hàng trước" });
      }

      const shopData = shopSnapshot.docs[0].data();

      const reviewRef = db.collection("reviews").doc(reviewId);
      const reviewSnapshot = await reviewRef.get();

      if (!reviewSnapshot.exists) {
        return res.status(404).json({ message: "Đánh giá không tồn tại" });
      }

      const reviewData = reviewSnapshot.data();
      const commend = reviewData.commend;

      commend.seller = {
        feedback: seller_feedback,
      };

      await reviewRef.update({
        commend: commend,
      });

      return res.status(200).json({
        message: "Trả lời đánh giá thành công!",
        metadata: reviewData,
      });
    } catch (error) {
      console.error("Error updating seller feedback:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}

module.exports = new ProductController();
