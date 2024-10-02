"use strict";

const { db } = require("../config/firebase.config"); // Đảm bảo đường dẫn chính xác

// Dữ liệu sản phẩm
const products = [
  {
    name: "Laptop Acer Aspire 7 A715-76G-59MW i5-12450H|8GB|512GB|RTX™ 2050 4GB|15.6'",
    description: "",
    evaluate: "5 Đánh Giá",
    original_price: 19490000,
    product_images: [
      "https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-ljghvd9tn3eqd4",
      "https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-ljghvd9tka9u76",
      "https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-ljghvd9thh4y5f",
      "https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-ljghvd9twxis58",
    ],
    promotional_quantity: "150",
    rate: "5",
    remaining_stock: "2500",
    sale_price: 21490000,
    selling: "5,3k Lượt Bán",
    shop_id: "Fj8XiQXfMh885eTVt0Sv",
    stock_quantity: 500,
    title: "",
    category_id: "",
    weight: "2.1kg",
  },
];

const seedProducts = async () => {
  try {
    const existingProductsSnapshot = await db.collection("products").get();
    const existingProductNames = new Set();

    // Lưu tên sản phẩm hiện tại vào tập hợp
    existingProductsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.name) {
        existingProductNames.add(data.name);
      }
    });

    // Tạo batch và biến đếm để theo dõi số lượng ghi
    const batch = db.batch();
    let productsAdded = 0;

    // Lọc sản phẩm mới và thêm vào batch
    for (const product of products) {
      if (!existingProductNames.has(product.name)) {
        const docRef = db.collection("products").doc(); // Tạo tài liệu mới với ID tự động
        const productId = docRef.id; // Lấy ID của tài liệu mới
        const productData = { ...product, product_id: productId }; // Thêm product_id vào dữ liệu sản phẩm
        batch.set(docRef, productData);
        productsAdded++;
      } else {
        console.log(`Product already exists: ${product.name}`);
      }
    }

    // Commit batch nếu có sản phẩm mới
    if (productsAdded > 0) {
      await batch.commit();
      console.log("New products added successfully!");
    } else {
      console.log("No new products to add.");
    }
  } catch (error) {
    console.error("Error adding products: ", error);
  }
};

seedProducts();
