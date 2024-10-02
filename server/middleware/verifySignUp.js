"use strict";

const { db } = require("../config/firebase.config");
const { BadRequestError } = require("../core/error.response");

const checkDuplicateEmail = async (req, res, next) => {
  try {
    const email = req.body.email;

    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!snapshot.empty) {
      return new BadRequestError({
        message: "Email này đã được đăng ký",
      }).send(res);
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

const checkDuplicatePhoneNumber = async (req, res, next) => {
  try {
    const phone_number = req.body.phonenumber;

    const snapshot = await db
      .collection("users")
      .where("phone_number", "==", phone_number)
      .get();

    if (!snapshot.empty) {
      return new BadRequestError({
        message: "Số điện thoại này đã được đăng ký",
      }).send(res);
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

const verifySignUp = {
  checkDuplicateEmail,
  checkDuplicatePhoneNumber,
};

module.exports = verifySignUp;
