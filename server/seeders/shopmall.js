"use strict";

const { db } = require("../config/firebase.config");

const shopData = [
  {
    shop_name: "HP_Official_Store",
    join_time: "2021-05-10T16:24:50",
    image:
      "https://down-cvs-vn.img.susercontent.com/6cd22645e35a68d60fb4708e1cb60769_tn.webp",
    shop_address: "Số 15, Đường A, Quận 1, TPHCM",
    rating: 4.8,
    total_products: 5,
    followers: 10000,
    responseRate: 100,
  },
  {
    shop_name: "ACER FLAGSHIP HCH STORE",
    join_time: "2019-03-10T16:10:50",
    image:
      "https://down-cvs-vn.img.susercontent.com/cef861a6e7da993ed465d8f83d719c92_tn.webp",
    shop_address: "Số 15, Đường B, Quận 9, TPHCM",
    rating: 4.9,
    total_products: 5,
    followers: 76000,
    responseRate: 100,
  },
  {
    shop_name: "LOGITECH OFFICIAL SHOP",
    join_time: "2019-02-08T16:00:00",
    image:
      "https://down-bs-vn.img.susercontent.com/97e16ce2497766d89209dc6348283b5f_tn.webp",
    shop_address: "Số 15, Đường B, Phường 9, Đà lạt, Lâm Đồng",
    rating: 4.9,
    total_products: 5,
    followers: 76000,
    responseRate: 100,
  },
  {
    shop_name: "MSI LAPTOP FLAGSHIP STORE",
    join_time: "2022-02-08T16:00:00",
    image:
      "https://down-bs-vn.img.susercontent.com/25b5e999ae26edf91441186cfcad2f93_tn.webp",
    shop_address: "Số 123, Đường C, Quận 2, TPHCM",
    rating: 4.9,
    total_products: 5,
    followers: 76000,
    responseRate: 100,
  },
];

async function seedData() {
  try {
    for (const shop of shopData) {
      // Tạo tài liệu mới và lấy shop_id tự động từ Firestore
      const newShopRef = db.collection("shops").doc(); // Tạo một doc mới mà không truyền shop_id
      const shop_id = newShopRef.id; // Lấy id từ doc mới tạo

      // Lưu dữ liệu vào Firestore, bao gồm shop_id và is_mall = true
      await newShopRef.set({
        shop_id, // Thêm shop_id vào dữ liệu
        is_mall: true, // Thêm is_mall với giá trị true
        ...shop,
      });

      console.log(
        `Shop ${shop.shop_name} has been added successfully with ID: ${shop_id}`
      );
    }
    console.log("Seeder completed successfully!");
  } catch (error) {
    console.error("Error seeding data: ", error);
  }
}

seedData();
