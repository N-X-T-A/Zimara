"use strict";

const express = require("express");
const asyncHandler = require("express-async-handler");
const categoryController = require("../controllers/category.controller");

const router = express.Router();

router.get("/", asyncHandler(categoryController.getAllCategory));

module.exports = router;
