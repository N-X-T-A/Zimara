"use strict";

const { CREATED, OK } = require("../core/success.response");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const userValidation = require("../validation/user");
const { db } = require("../config/firebase.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthController {
  signUp = async (req, res) => {
    const { error } = userValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((err) => err.message);
      return new BadRequestError({
        message: errors,
      }).send(res);
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      phone_number: req.body.phonenumber,
      photo_url:
        "https://firebasestorage.googleapis.com/v0/b/zimara-9672d.appspot.com/o/images%2Fusers%2Fdefault-avatar-profile.jpg?alt=media&token=cdd2433a-74fe-4172-a87f-409a1e0daf0b",
      role: "buyer",
    };

    const userRef = await db.collection("users").add(user);
    user.user_id = userRef.id;

    delete user.password;

    return new CREATED({
      message: "Đăng ký tài khoản thành công!",
      metadata: user,
    }).send(res);
  };

  login = async (req, res) => {
    const { email, password } = req.body;
    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (snapshot.empty) {
      return new AuthFailureError({
        message: "Email không đúng hoặc chưa được đăng ký.",
      }).send(res);
    }

    const user = snapshot.docs[0].data();
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return new AuthFailureError({
        message: "Mật khẩu không đúng.",
      }).send(res);
    }

    const token = generateToken(snapshot.docs[0].id, user.email, user.role);

    delete user.password;

    return new OK({
      message: "Đăng nhập thành công!",
      metadata: { token, user },
    }).send(res);
  };

  google = async (req, res) => {
    const { uid, username, email, photourl } = req.body;

    if (!uid || !username || !email) {
      return new BadRequestError({
        message: "Missing required fields: uid, username, or email.",
      }).send(res);
    }

    try {
      const userRef = db.collection("users").doc(uid);

      const doc = await userRef.get();

      let user;
      if (!doc.exists) {
        user = {
          username,
          email,
          role: "buyer",
          phone_number: null,
          photo_url: photourl,
        };
        await userRef.set(user);
      } else {
        user = doc.data();
      }

      const token = generateToken(uid, user.email, user.role);

      return new OK({
        message: "Google sign-in successful!",
        metadata: { token, user },
      }).send(res);
    } catch (error) {
      console.error("Error during Google sign-in:", error.message);
      return new BadRequestError({
        message: "Error during Google sign-in.",
      }).send(res);
    }
  };

  facebook = async (req, res) => {
    const { uid, username, email, photourl } = req.body;

    if (!uid || !username || !email) {
      return new BadRequestError({
        message: "Missing required fields: uid, username, or email.",
      }).send(res);
    }

    try {
      const userRef = db.collection("users").doc(uid);

      const doc = await userRef.get();

      let user;
      if (!doc.exists) {
        user = {
          username,
          email,
          role: "buyer",
          phone_number: null,
          photo_url: photourl,
        };
        await userRef.set(user);
      } else {
        user = doc.data();
      }

      const token = generateToken(uid, user.email, user.role);

      return new OK({
        message: "Facebook sign-in successful!",
        metadata: { token, user },
      }).send(res);
    } catch (error) {
      console.error("Error during Facebook sign-in:", error.message);
      return new BadRequestError({
        message: "Error during Facebook sign-in.",
      }).send(res);
    }
  };
}

const generateToken = (id, email, role) => {
  const token = jwt.sign(
    { user_id: id, email: email, role: role },
    process.env.SECRET_CODE,
    { expiresIn: "1h" }
  );
  return token;
};

module.exports = new AuthController();
