import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ products }) => {
    // Prepare data for the chart
    const labels = products.map((product) => product.titleproducts);
    const soldData = products.map((product) =>
        product.colors[0]
            ? Object.values(product.colors[0]).reduce((acc, details) => acc + parseInt(details.sold, 10), 0)
            : 0,
    );
    const returnData = products.map((product) =>
        product.colors[0]
            ? Object.values(product.colors[0]).reduce((acc, details) => acc + parseInt(details.return, 10), 0)
            : 0,
    );
    const differenceData = soldData.map((sold, index) => sold - returnData[index]);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Số Lượng Bán',
                data: soldData,
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1,
                barThickness: 20,
            },
            {
                label: 'Số Lượng Trả Hàng',
                data: returnData,
                backgroundColor: 'rgba(255, 0, 0, 0.5)',
                borderColor: 'rgba(255, 0, 0, 1)',
                borderWidth: 1,
                barThickness: 20,
            },
            {
                label: 'Số Lược Bán Được Sau Cùng',
                data: differenceData,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                barThickness: 20,
            },
        ],
    };

    const options = {
        scales: {
            x: {
                stacked: false,
                barPercentage: 0.8, // Adjust to control width of bars
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value.toLocaleString('vi-VN') + ' sản phẩm';
                    },
                },
            },
        },
        plugins: {
            legend: {
                display: true,
            },
            title: {
                display: true,
                text: 'Biểu Đồ Số Lượng Tổng Sản Phẩm Bản Ra - Trả Hàng  - Sản Phẩm Bán Được',
            },
        },
    };

    return (
        <div className="chart-container">
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default BarChart;
