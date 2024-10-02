import React, { useEffect, useState } from 'react';
import RevenueBarChart from './RevenueBarChart';

const RevenueDisplay = () => {
    const [revenues, setRevenues] = useState({
        totalLastMonthRevenue: 0,
        totalTwoMonthsRevenue: 0,
        totalThreeMonthsRevenue: 0,
        totalRevenue: 0,
    });

    const fetchData = async () => {
        try {
            const response = await fetch('API_URL'); // Thay thế API_URL bằng URL thật
            const data = await response.json();

            const totalRevenue = data.thisMonth || 0;
            const totalLastMonthRevenue = data.lastMonth || 0;
            const totalTwoMonthsRevenue = data.twoMonths || 0;
            const totalThreeMonthsRevenue = data.threeMonths || 0;

            // Tính toán nếu cần
            const calculatedTotalRevenue = totalRevenue; // Ví dụ tính toán nếu cần

            setRevenues({
                totalLastMonthRevenue,
                totalTwoMonthsRevenue,
                totalThreeMonthsRevenue,
                totalRevenue: calculatedTotalRevenue,
            });
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }
    };

    useEffect(() => {
        fetchData(); // Lần đầu tiên gọi API khi component mount

        const intervalId = setInterval(() => {
            fetchData(); // Gọi lại API mỗi 30 giây (30000ms)
        }, 30000);

        // Dọn dẹp interval khi component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="total-revenue">
            <h4>Tổng doanh thu tháng trước: {revenues.totalLastMonthRevenue.toLocaleString()} VNĐ</h4>
            <h4>Tổng doanh thu 2 tháng trước: {revenues.totalTwoMonthsRevenue.toLocaleString()} VNĐ</h4>
            <h4>Tổng doanh thu 3 tháng trước: {revenues.totalThreeMonthsRevenue.toLocaleString()} VNĐ</h4>
            <h4>Tổng doanh thu tháng này: {revenues.totalRevenue.toLocaleString()} VNĐ</h4>

            <RevenueBarChart {...revenues} />
        </div>
    );
};

export default RevenueDisplay;
