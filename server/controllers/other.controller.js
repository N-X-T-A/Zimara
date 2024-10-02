"use strict";

const { OK } = require("../core/success.response");
const { db } = require("../config/firebase.config");
require("dotenv").config();
const { bucket } = require("../config/firebase.config");
const path = require("path");

class Controller {
  getClientId = async (req, res) => {
    try {
      const clientID = process.env.CLIENT_ID;

      new OK({
        message: "Thành công",
        metadata: clientID,
      }).send(res);
    } catch (error) {
      console.error("Error getting shipping fee:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  getfee = async (req, res) => {
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

      const weightInKg = convertToKilograms(data.weight);
      const shipping_fee = calculateShippingCost(weightInKg);

      const shippingfee = {
        id: productDoc.id,
        cost: shipping_fee,
      };

      new OK({
        message: "Lấy phí vận chuyển thành công",
        metadata: shippingfee,
      }).send(res);
    } catch (error) {
      console.error("Error getting shipping fee:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  uploadImage = async (req, res) => {
    try {
      const MAX_SIZE = 1 * 1024 * 1024;
      const folderPath = "images/users/";

      if (req.file.size > MAX_SIZE) {
        return res.status(400).send("Kích thước File tối đa là 1MB.");
      }

      const blob = bucket.file(`${folderPath}${req.file.originalname}`);

      const stream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      stream.on("error", (err) => {
        console.error(err);
        return res.status(500).send(err);
      });

      stream.on("finish", async () => {
        await blob.makePublic();

        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(blob.name)}?alt=media`;
        console.log("Uploaded image URL:", publicUrl);

        res.status(200).send({ url: publicUrl });
      });

      stream.end(req.file.buffer);
    } catch (error) {
      res.status(500).send(error);
      console.log(error);
    }
  };
}

module.exports = new Controller();

const convertToKilograms = (weight) => {
  if (typeof weight === "string") {
    if (weight.endsWith("kg")) {
      return parseFloat(weight);
    } else if (weight.endsWith("g")) {
      return parseFloat(weight) / 1000;
    } else {
      throw new Error('Invalid weight format: must end with "kg" or "g"');
    }
  } else if (typeof weight === "number") {
    return weight;
  } else {
    throw new Error("Invalid weight format: must be a string or number");
  }
};

const calculateShippingCost = (weight) => {
  const baseRate = 20000;
  const ratePerKg = 10000;
  const maxCost = 80000;

  const cost = baseRate + ratePerKg * weight;
  return Math.min(cost, maxCost);
};
