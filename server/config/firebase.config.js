"use strict";
require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL,
  storageBucket: process.env.SB_URL,
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { db, bucket };
