import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { hide } from '@popperjs/core';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChartAdmin = ({ products }) => {
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
    const netSalesData = soldData.map((sold, index) => sold - returnData[index]);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Số Lượng Bán',
                data: soldData,
                borderColor: 'rgba(0, 123, 255, 1)',
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                tension: 0.4, // Smooth curve
            },
            {
                label: 'Số Lượng Trả Hàng',
                data: returnData,
                borderColor: 'rgba(255, 0, 0, 1)',
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                tension: 0.4,
            },
            {
                label: 'Số Lượng Bán Được Sau Cùng',
                data: netSalesData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
            },
        ],
    };

    const options = {
        scales: {
            x: {
                display: false,
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
                text: 'Biểu Đồ Số Lượng Bán - Trả Hàng - Số Lượng Cuối Cùng',
            },
        },
    };

    return (
        <div className="chart-container">
            <Line data={chartData} options={options} />
        </div>
    );
};

export default LineChartAdmin;
