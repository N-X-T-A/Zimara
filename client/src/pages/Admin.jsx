import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import '../style/Pages/admin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faUser, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import LineChartAdmin from '../components/Chart/Chartlineadmin';
import RevenueBarChart from '../components/Chart/RevenueBarChart';
import TotalRevenueChart from '../components/Chart/totalRevenueChart';

const AdminPage = () => {
    const [shops, setShops] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeSidebar, setActiveSidebar] = useState('overview');
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalSoldProducts, setTotalSoldProducts] = useState(0);
    const [monthlyRevenue, setMonthlyRevenue] = useState({
        lastMonth: 0,
        twoMonthsAgo: 0,
        threeMonthsAgo: 0,
    });

    // Fetch shop and user data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [shopsResponse, usersResponse] = await Promise.all([
                    fetch('http://localhost:3000/Shops'),
                    fetch('http://localhost:3000/Users'),
                ]);

                if (!shopsResponse.ok || !usersResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const shopsData = await shopsResponse.json();
                const usersData = await usersResponse.json();

                console.log('Shops data:', shopsData);
                console.log('Users data:', usersData);

                setShops(shopsData);
                setUsers(usersData);
                setTotalProducts(shopsData.flatMap((shop) => shop.Product).length); // Calculate total products
                setTotalUsers(usersData.length); // Set total users count

                // Calculate total revenue and monthly revenue
                const revenues = shopsData.map(
                    (shop) => parseFloat(shop.revenue[0]["lastmonth'srevenue"].replace(/\./g, '')) || 0,
                );
                const twoMonthsAgoRevenue = shopsData.map(
                    (shop) => parseFloat(shop.revenue[0].revenue2monthsago.replace(/\./g, '')) || 0,
                );
                const threeMonthsAgoRevenue = shopsData.map(
                    (shop) => parseFloat(shop.revenue[0].revenue3monthsago.replace(/\./g, '')) || 0,
                );

                setTotalRevenue(revenues.reduce((acc, curr) => acc + curr, 0)); // Total revenue for this month
                setMonthlyRevenue({
                    lastMonth: revenues.reduce((acc, curr) => acc + curr, 0),
                    twoMonthsAgo: twoMonthsAgoRevenue.reduce((acc, curr) => acc + curr, 0),
                    threeMonthsAgo: threeMonthsAgoRevenue.reduce((acc, curr) => acc + curr, 0),
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Function to calculate total revenue for a shop
    const calculateShopTotalRevenue = (shop) => {
        return shop.revenue[0] ? parseFloat(shop.revenue[0]["lastmonth'srevenue"].replace(/\./g, '')) || 0 : 0;
    };

    return (
        <>
            <Header />
            <div className="container-fluid">
                <div className="row">
                    <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
                        <div className="position-sticky">
                            <ul className="nav flex-column">
                                {['overview', 'Shops', 'users', 'categories'].map((item) => (
                                    <li className="nav-item" key={item}>
                                        <button
                                            className={`nav-link ${activeSidebar === item ? 'active' : ''}`}
                                            onClick={() => setActiveSidebar(item)}
                                            aria-current={activeSidebar === item ? 'page' : undefined}
                                        >
                                            {item === 'overview' && 'Tổng quan'}
                                            {item === 'Shops' && 'Cửa Hàng'}
                                            {item === 'users' && 'Người Dùng'}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </nav>
                    <main className="col-md-9 ms-sm-auto col-lg-10">
                        {activeSidebar === 'overview' && (
                            <div className="page-title">
                                <div className="row">
                                    <div className="col m-2 cardadmin">
                                        <div className="icon-container">
                                            <FontAwesomeIcon icon={faBox} className="icon" />
                                        </div>
                                        <div className="info">
                                            <div className="count">{totalProducts}</div>
                                            <div className="description">
                                                <p>Sản Phẩm Có Mặt Trên Cửa Hàng</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col m-2 cardadmin">
                                        <div className="icon-container">
                                            <FontAwesomeIcon icon={faUser} className="icon" />
                                        </div>
                                        <div className="info">
                                            <div className="count">{totalUsers}</div> {/* Display total users */}
                                            <div className="description">
                                                <p>Số Lượng Người Dùng</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-5 m-2 cardadmin">
                                        <div className="icon-container">
                                            <FontAwesomeIcon icon={faDollarSign} className="icon" />
                                        </div>
                                        <div className="info">
                                            <div className="count">{totalRevenue.toLocaleString()} VNĐ</div>{' '}
                                            {/* Display total revenue */}
                                            <div className="description">
                                                <p>Tổng Doanh Thu / Sản Phẩm Đã Bán</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <LineChartAdmin products={shops.flatMap((shop) => shop.Product)} />

                                <div className="row">
                                    <div className="col">
                                        <RevenueBarChart
                                            lastMonth={monthlyRevenue.lastMonth}
                                            twoMonthsAgo={monthlyRevenue.twoMonthsAgo}
                                            threeMonthsAgo={monthlyRevenue.threeMonthsAgo}
                                        />
                                    </div>
                                    <div className="col">
                                        <TotalRevenueChart totalRevenue={totalRevenue} />
                                    </div>
                                </div>
                                <div className="total-revenue">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Thời Gian</th>
                                                <th>Doanh Thu (VNĐ)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Tháng Trước</td>
                                                <td>{monthlyRevenue.lastMonth.toLocaleString()} VNĐ</td>
                                            </tr>
                                            <tr>
                                                <td>Hai Tháng Trước</td>
                                                <td>{monthlyRevenue.twoMonthsAgo.toLocaleString()} VNĐ</td>
                                            </tr>
                                            <tr>
                                                <td>Ba Tháng Trước</td>
                                                <td>{monthlyRevenue.threeMonthsAgo.toLocaleString()} VNĐ</td>
                                            </tr>
                                            <tr>
                                                <td>Doanh Thu Tháng Này</td>
                                                <td>{totalRevenue.toLocaleString()} VNĐ</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        {activeSidebar === 'Shops' && (
                            <div className="page-title">
                                <h2>Danh Sách Cửa Hàng</h2>
                                <table className="shop-table">
                                    <thead>
                                        <tr>
                                            <th>ID Cửa Hàng</th>
                                            <th>Tên Cửa Hàng</th>
                                            <th>Số Lượng Sản Phẩm</th>
                                            <th>Tổng Doanh Thu Tháng Này (VNĐ)</th>
                                            <th>Doanh Thu Tháng Trước (VNĐ)</th>
                                            <th>Doanh Thu Hai Tháng Trước (VNĐ)</th>
                                            <th>Doanh Thu Ba Tháng Trước (VNĐ)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {shops.map((shop) => (
                                            <tr key={shop.idshop}>
                                                <td>{shop.idshop}</td>
                                                <td>
                                                    <Link to={`/mastershop/${shop.idshop}`} className="shop-link">
                                                        {shop.name}
                                                    </Link>
                                                </td>
                                                <td>{shop.Product ? shop.Product.length : 0}</td>
                                                <td>{calculateShopTotalRevenue(shop).toLocaleString()} VNĐ</td>
                                                <td>
                                                    {parseFloat(
                                                        shop.revenue[0]["lastmonth'srevenue"].replace(/\./g, ''),
                                                    ).toLocaleString()}{' '}
                                                    VNĐ
                                                </td>
                                                <td>
                                                    {parseFloat(
                                                        shop.revenue[0].revenue2monthsago.replace(/\./g, ''),
                                                    ).toLocaleString()}{' '}
                                                    VNĐ
                                                </td>
                                                <td>
                                                    {parseFloat(
                                                        shop.revenue[0].revenue3monthsago.replace(/\./g, ''),
                                                    ).toLocaleString()}{' '}
                                                    VNĐ
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {activeSidebar === 'users' && (
                            <div className="page-title">
                                <table className="user-table">
                                    <thead>
                                        <tr>
                                            <th>Hình Ảnh</th>
                                            <th>Tên Người Dùng</th>
                                            <th>Email</th>
                                            <th>Điện Thoại</th>
                                            <th>Địa Chỉ</th>
                                            <th>Truy Cập</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.userid}>
                                                <td>
                                                    <img
                                                        src={user.imageuser}
                                                        alt={user.username}
                                                        className="user-image"
                                                    />
                                                </td>
                                                <td>{user.username}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phonenumber}</td>
                                                <td>
                                                    {user.address}, {user.ward}, {user.city}
                                                </td>
                                                <td>
                                                    <td>
                                                        <Link to={`/user/${user.userid}`} className="user-link">
                                                            Xem Chi Tiết
                                                        </Link>
                                                    </td>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
};

export default AdminPage;
