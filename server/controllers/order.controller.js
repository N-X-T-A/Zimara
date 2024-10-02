"use strict";

const { db } = require("../config/firebase.config");
const { CREATED, OK } = require("../core/success.response");

class OrderController {
  createOrder = async (req, res) => {
    try {
      const {
        product_id,
        quantity,
        payment_method,
        shipping_address,
        estimated_delivery_date,
        tracking_number,
        customer_note,
      } = req.body;
      const user_id = req.user.user_id;

      const productSnapshot = await db
        .collection("products")
        .doc(product_id)
        .get();
      if (!productSnapshot.exists) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }

      const productData = productSnapshot.data();
      const { original_price, sale_price } = productData;

      // Tính toán doanh thu và lợi nhuận
      const revenue = quantity * sale_price;
      const profit = (sale_price - original_price) * quantity;

      const orderData = {
        user_id,
        product_id,
        shop_id: productData.shop_id,
        status: "pending confirmation",
        quantity,
        payment_method,
        payment_status: "pending",
        tracking_number,
        shipping_address,
        ship_from_address: "",
        estimated_delivery_date,
        delivery_date: null,
        cancellation_reason: null,
        shipping_cost: 0,
        tax_amount: 0,
        customer_note,
        review: null,
      };

      const orderRef = await db.collection("orders").add(orderData);
      const orderId = orderRef.id;

      const shopId = productData.shop_id;
      const shopRef = await db.collection("shops").doc(shopId).get();
      const shopAddress = shopRef.data().shop_address;

      await orderRef.update({ ship_from_address: shopAddress });

      const saleData = {
        product_id,
        customer_id: user_id,
        sale_date: new Date(),
        quantity,
        revenue,
        profit,
      };

      await db.collection("sales").add(saleData);

      return res.status(201).json({
        message:
          "Đơn hàng đã được tạo và thông tin bán hàng đã được ghi lại thành công!",
        order_id: orderId,
        metadata: orderData,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        name: error.name,
        message: error.message,
      });
    }
  };
  updateOrderStatus = async (req, res) => {
    const { order_id } = req.params;
    const { status } = req.body;

    try {
      const orderRef = db.collection("orders").doc(order_id);
      const orderDoc = await orderRef.get();

      if (!orderDoc.exists) {
        return res.status(404).json({ message: "Đơn hàng không tồn tại" });
      }

      await orderRef.update({
        status,
        updated_at: new Date(),
      });

      return new OK({
        message: "Trạng thái đơn hàng đã được cập nhật thành công!",
      }).send(res);
    } catch (error) {
      return res.status(500).json({
        message: "Đã xảy ra lỗi khi cập nhật trạng thái",
        error: error.message,
      });
    }
  };
  getOrder = async (req, res) => {
    try {
      const orderSnapshot = await db
        .collection("orders")
        .where("user_id", "==", req.user.user_id)
        .get();
      const orderDoc = orderSnapshot.docs[0].data();
      const productSnapShot = await db
        .collection("products")
        .doc(orderDoc.product_id)
        .get();

      const productData = productSnapShot.data();
      const product = {
        product_id: productSnapShot.id,
        product_name: productData.name,
        product_images: productData.product_images,
      };

      const shopSnapShot = await db
        .collection("shops")
        .doc(orderDoc.shop_id)
        .get();

      const shopData = shopSnapShot.data();

      const shop = {
        shop_id: shopData.shop_id,
        shop_name: shopData.shop_name,
      };

      const order = orderSnapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          status: data.status,
          shop,
          product,
        };
      });

      return new OK({
        message: "Trạng thái đơn hàng đã được cập nhật thành công!",
        metadata: order,
      }).send(res);
    } catch (error) {
      return res.status(500).json({
        message: "Đã xảy ra lỗi khi lấy đơn hàng",
        error: error.message,
      });
    }
  };
}

module.exports = new OrderController();
