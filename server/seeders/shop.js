"use strict";

const { db } = require("../config/firebase.config");

// Sample categories list
const categories = [
  "Thời Trang Nam",
  "Thời Trang Nữ",
  "Điện Thoại & Phụ Kiện",
  "Mẹ & Bé",
  "Thiết Bị Điện Tử",
  "Nhà Cửa & Đời Sống",
  "Máy Tính & Laptop",
  "Sắc Đẹp",
  "Máy Ảnh & Máy Quay Phim",
  "Sức Khỏe",
];

// Sample user data
const userSampleData = [
  {
    email: "nguyenvan01@example.com",
    password: "$2a$10$OgWXR.A2/lcwZx.PsKUS/efz2jjbMthYH2Tj5xzZCSjoYQEnb9gTq",
    phone_number: "0897124001",
    role: "buyer",
    username: "nguyenvan01",
  },
  {
    email: "nguyenvan02@example.com",
    password: "$2a$10$OgWXR.A2/lcwZx.PsKUS/efz2jjbMthYH2Tj5xzZCSjoYQEnb9gTq",
    phone_number: "0897124002",
    role: "buyer",
    username: "nguyenvan02",
  },
  {
    email: "nguyenvan03@example.com",
    password: "$2a$10$OgWXR.A2/lcwZx.PsKUS/efz2jjbMthYH2Tj5xzZCSjoYQEnb9gTq",
    phone_number: "0897124003",
    role: "buyer",
    username: "nguyenvan03",
  },
  {
    email: "nguyenvan04@example.com",
    password: "$2a$10$OgWXR.A2/lcwZx.PsKUS/efz2jjbMthYH2Tj5xzZCSjoYQEnb9gTq",
    phone_number: "0897124004",
    role: "buyer",
    username: "nguyenvan04",
  },
  {
    email: "nguyenvan05@example.com",
    password: "$2a$10$OgWXR.A2/lcwZx.PsKUS/efz2jjbMthYH2Tj5xzZCSjoYQEnb9gTq",
    phone_number: "0897124005",
    role: "buyer",
    username: "nguyenvan05",
  },
  {
    email: "nguyenvan06@example.com",
    password: "$2a$10$OgWXR.A2/lcwZx.PsKUS/efz2jjbMthYH2Tj5xzZCSjoYQEnb9gTq",
    phone_number: "0897124006",
    role: "buyer",
    username: "nguyenvan06",
  },
  {
    email: "nguyenvan07@example.com",
    password: "$2a$10$OgWXR.A2/lcwZx.PsKUS/efz2jjbMthYH2Tj5xzZCSjoYQEnb9gTq",
    phone_number: "0897124007",
    role: "buyer",
    username: "nguyenvan07",
  },
  {
    email: "nguyenvan08@example.com",
    password: "$2a$10$OgWXR.A2/lcwZx.PsKUS/efz2jjbMthYH2Tj5xzZCSjoYQEnb9gTq",
    phone_number: "0897124008",
    role: "buyer",
    username: "nguyenvan08",
  },
  {
    email: "nguyenvan09@example.com",
    password: "$2a$10$OgWXR.A2/lcwZx.PsKUS/efz2jjbMthYH2Tj5xzZCSjoYQEnb9gTq",
    phone_number: "0897124009",
    role: "buyer",
    username: "nguyenvan09",
  },
  {
    email: "nguyenvan10@example.com",
    password: "$2a$10$OgWXR.A2/lcwZx.PsKUS/efz2jjbMthYH2Tj5xzZCSjoYQEnb9gTq",
    phone_number: "0897124010",
    role: "buyer",
    username: "nguyenvan10",
  },
];

async function seed() {
  try {
    // Step 1: Create users
    const userRefs = await Promise.all(
      userSampleData.map(async (userData) => {
        const userRef = await db.collection("users").add(userData);
        return userRef.id;
      })
    );

    console.log("Users created.");

    // Step 2: Create shops
    const shopPromises = userRefs.map((userId, index) => {
      const shopData = {
        shop_id: `shop_${userId}`,
        shop_name: `Shop của user_${index + 1}`,
        owner_id: userId,
        shop_description: `Shop dành cho danh mục: ${
          categories[index % categories.length]
        }`,
        shop_address: "666 ABC TPHCM",
        is_mall: false,
        join_time: new Date().toISOString(),
      };

      return db.collection("shops").add(shopData);
    });

    await Promise.all(shopPromises);
    console.log("Shops created.");
  } catch (error) {
    console.error("Error seeding data: ", error);
  }
}

// Run seeder
seed();
