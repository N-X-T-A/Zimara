import React from 'react';
import { Bar } from 'react-chartjs-2';

const TotalRevenueChart = ({ totalRevenue }) => {
    const data = {
        labels: ['Doanh Thu Tháng Này'],
        datasets: [
            {
                label: 'Doanh Thu (VNĐ)',
                data: [totalRevenue],
                backgroundColor: 'rgba(255, 99, 132, 0.6)', // Đổi màu nền
                borderColor: 'rgba(255, 99, 132, 1)', // Đổi màu viền
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value.toLocaleString() + ' VNĐ';
                    },
                },
            },
        },
    };

    return (
        <div className="totalRevenueChart">
            <Bar data={data} options={options} />
        </div>
    );
};

export default TotalRevenueChart;
