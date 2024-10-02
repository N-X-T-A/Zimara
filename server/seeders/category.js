"use strict";

const { db } = require("../config/firebase.config"); // Đảm bảo đường dẫn chính xác

const categories = [
  {
    name: "Thời Trang Nam",
    subCategories: ["Áo", "Quần", "Giày", "Phụ kiện"],
  },
  {
    name: "Thời Trang Nữ",
    subCategories: ["Đầm", "Áo", "Chân váy", "Giày cao gót", "Phụ kiện"],
  },
  {
    name: "Điện Thoại & Phụ Kiện",
    subCategories: ["Điện Thoại", "Phụ Kiện Điện Thoại", "Ốp Lưng", "Cáp Sạc"],
  },
  {
    name: "Mẹ & Bé",
    subCategories: ["Sữa", "Tã", "Đồ chơi cho bé", "Quần áo trẻ em"],
  },
  {
    name: "Thiết Bị Điện Tử",
    subCategories: ["Điện Thoại", "Tivi", "Loa", "Máy tính bảng"],
  },
  {
    name: "Nhà Cửa & Đời Sống",
    subCategories: ["Đồ dùng nhà bếp", "Nội thất", "Trang trí nhà cửa"],
  },
  {
    name: "Máy Tính & Laptop",
    subCategories: [
      "Laptop",
      "Máy tính để bàn",
      "Phụ kiện máy tính",
      "Chuột & Bàn phím",
    ],
  },
  {
    name: "Sắc Đẹp",
    subCategories: ["Mỹ phẩm", "Chăm sóc da", "Nước hoa", "Dụng cụ làm đẹp"],
  },
  {
    name: "Máy Ảnh & Máy Quay Phim",
    subCategories: ["Máy ảnh DSLR", "Máy quay phim", "Phụ kiện máy ảnh"],
  },
  {
    name: "Sức Khỏe",
    subCategories: [
      "Thực phẩm chức năng",
      "Thiết bị y tế",
      "Dụng cụ tập thể dục",
    ],
  },
  {
    name: "Đồng Hồ",
    subCategories: ["Đồng hồ nam", "Đồng hồ nữ", "Phụ kiện đồng hồ"],
  },
  {
    name: "Giày Dép Nữ",
    subCategories: ["Giày cao gót", "Giày thể thao", "Dép nữ", "Sandal nữ"],
  },
  {
    name: "Giày Dép Nam",
    subCategories: ["Giày thể thao", "Giày tây", "Dép nam", "Sandal nam"],
  },
  {
    name: "Túi Ví Nữ",
    subCategories: ["Túi xách", "Ví cầm tay", "Túi đeo chéo"],
  },
  {
    name: "Thiết Bị Điện Gia Dụng",
    subCategories: ["Máy giặt", "Tủ lạnh", "Máy điều hòa", "Lò vi sóng"],
  },
  {
    name: "Phụ Kiện & Trang Sức Nữ",
    subCategories: ["Bông tai", "Vòng cổ", "Nhẫn", "Lắc tay"],
  },
  {
    name: "Thể Thao & Du Lịch",
    subCategories: ["Đồ bơi", "Dụng cụ thể thao", "Ba lô du lịch", "Vali"],
  },
  {
    name: "Bách Hóa Online",
    subCategories: ["Thực phẩm khô", "Đồ uống", "Gia vị", "Đồ hộp"],
  },
  {
    name: "Ô Tô & Xe Máy & Xe Đạp",
    subCategories: ["Xe đạp", "Xe máy", "Phụ tùng ô tô", "Phụ tùng xe máy"],
  },
  {
    name: "Nhà Sách Online",
    subCategories: [
      "Sách giáo khoa",
      "Sách văn học",
      "Sách kỹ năng",
      "Dụng cụ học tập",
    ],
  },
  {
    name: "Balo & Túi Ví Nam",
    subCategories: ["Balo", "Túi đeo chéo", "Ví da", "Cặp xách"],
  },
  {
    name: "Thời Trang Trẻ Em",
    subCategories: [
      "Quần áo bé trai",
      "Quần áo bé gái",
      "Giày dép trẻ em",
      "Phụ kiện trẻ em",
    ],
  },
  {
    name: "Đồ Chơi",
    subCategories: [
      "Đồ chơi giáo dục",
      "Đồ chơi vận động",
      "Lego",
      "Đồ chơi mô hình",
    ],
  },
  {
    name: "Giặt Giũ & Chăm Sóc Nhà Cửa",
    subCategories: [
      "Nước giặt",
      "Nước xả vải",
      "Dụng cụ lau nhà",
      "Chất tẩy rửa",
    ],
  },
  {
    name: "Chăm Sóc Thú Cưng",
    subCategories: [
      "Thức ăn cho thú cưng",
      "Đồ chơi thú cưng",
      "Vệ sinh cho thú cưng",
    ],
  },
  {
    name: "Voucher & Dịch Vụ",
    subCategories: [
      "Voucher ăn uống",
      "Voucher mua sắm",
      "Dịch vụ giải trí",
      "Dịch vụ du lịch",
    ],
  },
  {
    name: "Dụng cụ và thiết bị tiện ích",
    subCategories: ["Dụng cụ cầm tay", "Thiết bị điện", "Dụng cụ sửa chữa"],
  },
];
const categoryData = categories.map((category) => {
  const imageName = category.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .toLowerCase();

  return {
    name: category.name,
    image: `/images/categories/${imageName}.png`,
    subCategories: category.subCategories.map((sub) => ({
      id: db.collection("subcategories").doc().id, // Tạo id duy nhất cho từng subcategory
      name: sub,
      image: `/images/categories/${imageName}_${sub
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_")
        .toLowerCase()}.png`,
    })),
  };
});

const seedCategories = async () => {
  try {
    const batch = db.batch();
    categoryData.forEach((category) => {
      const docRef = db.collection("categories").doc();
      batch.set(docRef, {
        name: category.name,
        image: category.image,
        subCategories: category.subCategories,
      });
    });
    await batch.commit();
    console.log("Categories and subcategories with IDs added successfully!");
  } catch (error) {
    console.error("Error adding categories and subcategories: ", error);
  }
};

seedCategories();
