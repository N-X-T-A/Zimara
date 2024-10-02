import React from 'react';
import { Bar } from 'react-chartjs-2';

const RevenueBarChart = ({ lastMonth, twoMonthsAgo, threeMonthsAgo }) => {
    const data = {
        labels: ['Tháng Này', 'Tháng Trước', 'Hai Tháng Trước'],
        datasets: [
            {
                label: 'Doanh Thu (VNĐ)',
                data: [lastMonth, twoMonthsAgo, threeMonthsAgo],
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <Bar data={data} options={options} />
        </div>
    );
};

export default RevenueBarChart;
