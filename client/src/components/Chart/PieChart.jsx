import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ products }) => {
    const labels = products.map((product) => product.titleproducts); // Tên các sản phẩm

    // Tính tổng doanh thu của cửa hàng
    const totalStoreRevenue = products.reduce((acc, product) => {
        return (
            acc +
            (product.colors[0]
                ? Object.entries(product.colors[0]).reduce((prodAcc, [color, details]) => {
                      const originalPrice = parseFloat(details.price.original.replace(/[\.,]/g, '')); // Lấy giá gốc
                      const sold = parseInt(details.sold, 10); // Số lượng bán
                      const returns = parseInt(details.return, 10); // Số lượng trả
                      const revenue = originalPrice * (sold - returns); // Doanh thu = giá gốc * (số bán - số trả)
                      return prodAcc + revenue;
                  }, 0)
                : 0)
        );
    }, 0);

    // Dữ liệu biểu đồ: Doanh thu từng sản phẩm
    const data = {
        labels, // Tên sản phẩm
        datasets: [
            {
                label: 'Doanh Thu Từng Sản Phẩm',
                data: products.map((product) => {
                    return product.colors[0]
                        ? Object.entries(product.colors[0]).reduce((prodAcc, [color, details]) => {
                              const originalPrice = parseFloat(details.price.original.replace(/[\.,]/g, '')); // Lấy giá gốc
                              const sold = parseInt(details.sold, 10); // Số lượng bán
                              const returns = parseInt(details.return, 10); // Số lượng trả
                              const revenue = originalPrice * (sold - returns); // Doanh thu = giá gốc * (số bán - số trả)
                              return prodAcc + revenue; // Cộng dồn doanh thu
                          }, 0)
                        : 0; // Trả về 0 nếu không có màu sắc
                }),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733', '#C70039'], // Màu sắc cho các sản phẩm
                borderColor: 'rgba(255, 255, 255, 0.7)', // Màu đường viền
                borderWidth: 1, // Độ rộng đường viền
            },
        ],
    };

    // Cấu hình biểu đồ
    const options = {
        plugins: {
            legend: {
                position: 'top', // Vị trí của chú giải
            },
            tooltip: {
                callbacks: {
                    // Hiển thị thông tin tooltip cho mỗi phần của biểu đồ
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw; // Giá trị doanh thu
                        return `${label}: ${value.toLocaleString()} VNĐ (${((value / totalStoreRevenue) * 100).toFixed(
                            2,
                        )}%)`; // Hiển thị phần trăm đóng góp
                    },
                },
            },
        },
    };

    return (
        <div style={{ width: '500px', height: '500px' }}>
            <Pie data={data} options={options} /> {/* Hiển thị biểu đồ */}
        </div>
    );
};

export default PieChart;
