import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import '../style/Pages/User.css';
import OrderList from '../components/orderlist';

const Dialog = ({ isOpen, title, children, onClose, onConfirm }) => {
    return (
        <div className={`dialog ${isOpen ? 'active' : ''}`}>
            <div className="dialog-header">{title}</div>
            <div className="dialog-body">{children}</div>
            <div className="dialog-footer">
                <button onClick={onClose}>Hủy</button>
                <button onClick={onConfirm}>Xác Nhận</button>
            </div>
        </div>
    );
};

const User = () => {
    const { Id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSidebar, setActiveSidebar] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [activeOrdersMenu, setActiveOrdersMenu] = useState('allOrders');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [enteredPassword, setEnteredPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get('http://localhost:3000/Users');
                const data = response.data;

                if (!Array.isArray(data)) {
                    throw new Error('Định dạng dữ liệu không hợp lệ: Dữ liệu không phải là mảng');
                }

                const userId = parseInt(Id, 10);
                const foundUser = data.find((user) => user.userid === userId);

                if (!foundUser) {
                    throw new Error('Không tìm thấy người dùng với ID này');
                }

                setUser(foundUser);
            } catch (error) {
                setError(error.message || 'Lỗi khi lấy dữ liệu người dùng.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [Id]);

    const handleSave = async () => {
        try {
            const response = await axios.put(`http://localhost:3000/Users/${user.userid}`, user);

            if (response.status === 200) {
                alert('Đã lưu thay đổi thành công');
            } else {
                alert('Lưu thay đổi không thành công');
            }
        } catch (error) {
            alert('Đã xảy ra lỗi khi lưu thay đổi');
        } finally {
            setIsEditing(false);
        }
    };

    const handleEdit = () => {
        setIsDialogOpen(true);
    };

    const handleEditConfirm = () => {
        if (enteredPassword.trim() === '') {
            setErrorMessage('Vui lòng nhập mật khẩu!');
        } else if (enteredPassword === user.password) {
            setIsEditing(true);
            setErrorMessage('');
        } else {
            setErrorMessage('Mật khẩu không đúng!');
        }
        setEnteredPassword('');
    };

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>{error}</p>;
    if (!user) return <p>Không có dữ liệu người dùng</p>;

    return (
        <>
            <Header />
            <div className="container pt-3 user-container">
                <div className="row">
                    <div className="col-1 sidebar">
                        <ul>
                            <li
                                className={activeSidebar === 'profile' ? 'active' : ''}
                                onClick={() => setActiveSidebar('profile')}
                            >
                                Hồ sơ
                            </li>
                            <li
                                className={activeSidebar === 'orders' ? 'active' : ''}
                                onClick={() => setActiveSidebar('orders')}
                            >
                                Đơn hàng
                            </li>
                            <li
                                className={activeSidebar === 'settings' ? 'active' : ''}
                                onClick={() => setActiveSidebar('settings')}
                            >
                                Cài đặt
                            </li>
                            <li
                                className={activeSidebar === 'notifications' ? 'active' : ''}
                                onClick={() => setActiveSidebar('notifications')}
                            >
                                Thông báo
                            </li>
                        </ul>
                    </div>
                    <div className="col content">
                        {activeSidebar === 'profile' && (
                            <div className="profile-section">
                                <div className="row">
                                    <div className="col profile-info">
                                        <h2>Hồ Sơ Của Tôi</h2>
                                        <table className="profile-table">
                                            <tbody>
                                                <tr>
                                                    <th>Tên đăng nhập:</th>
                                                    <td>{user.loginname}</td>
                                                </tr>
                                                <tr>
                                                    <th>Tên:</th>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={user.username}
                                                            disabled={!isEditing}
                                                            onChange={(e) =>
                                                                setUser({ ...user, username: e.target.value })
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Email:</th>
                                                    <td>
                                                        <input
                                                            type="email"
                                                            value={user.email}
                                                            disabled={!isEditing}
                                                            onChange={(e) =>
                                                                setUser({ ...user, email: e.target.value })
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Số điện thoại:</th>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={user.phonenumber}
                                                            disabled={!isEditing}
                                                            onChange={(e) =>
                                                                setUser({ ...user, phonenumber: e.target.value })
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Giới tính:</th>
                                                    <td className="row m-0 gender-cell">
                                                        {user.gender.map((gender, index) => (
                                                            <div key={index} className="col gender-option">
                                                                <input
                                                                    type="radio"
                                                                    id={gender}
                                                                    name="gender"
                                                                    value={gender}
                                                                    checked={gender === 'nam'}
                                                                    readOnly
                                                                />
                                                                <label htmlFor={gender}>
                                                                    {gender === 'nam' ? 'Nam' : 'Nữ'}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Ngày sinh:</th>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={user.dateofbirth}
                                                            disabled={!isEditing}
                                                            onChange={(e) =>
                                                                setUser({ ...user, dateofbirth: e.target.value })
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Mật khẩu:</th>
                                                    <td>
                                                        <input
                                                            type={isEditing ? 'text' : 'password'}
                                                            value={user.password}
                                                            disabled={!isEditing}
                                                            onChange={(e) =>
                                                                setUser({ ...user, password: e.target.value })
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        {isEditing ? (
                                            <button onClick={handleSave}>Lưu</button>
                                        ) : (
                                            <button onClick={handleEdit}>Chỉnh sửa</button>
                                        )}
                                    </div>
                                    <div className="col profile-image">
                                        <img src={user.imageuser} alt="Hồ Sơ" />
                                        <button>Chọn Ảnh</button>
                                        <p className="file-size-info">
                                            Dung lượng file tối đa 1 MB
                                            <br />
                                            Định dạng: .JPEG, .PNG
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSidebar === 'orders' && (
                            <div className="pt-3 orders-section">
                                <div className="orders-menu">
                                    <div className="row">
                                        <div
                                            className={`col ${activeOrdersMenu === 'allOrders' ? 'active' : ''}`}
                                            onClick={() => setActiveOrdersMenu('allOrders')}
                                        >
                                            <button>Tất Cả Đơn Hàng</button>
                                        </div>
                                        <div
                                            className={`col ${activeOrdersMenu === 'pending' ? 'active' : ''}`}
                                            onClick={() => setActiveOrdersMenu('pending')}
                                        >
                                            <button>Chờ Xử Lý</button>
                                        </div>
                                        <div
                                            className={`col ${activeOrdersMenu === 'shipping' ? 'active' : ''}`}
                                            onClick={() => setActiveOrdersMenu('shipping')}
                                        >
                                            <button>Đang Vận Chuyển</button>
                                        </div>
                                        <div
                                            className={`col ${activeOrdersMenu === 'completed' ? 'active' : ''}`}
                                            onClick={() => setActiveOrdersMenu('completed')}
                                        >
                                            <button>Hoàn Thành</button>
                                        </div>
                                        <div
                                            className={`col ${activeOrdersMenu === 'canceled' ? 'active' : ''}`}
                                            onClick={() => setActiveOrdersMenu('canceled')}
                                        >
                                            <button>Đã Hủy</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="orders-content">
                                    {Array.isArray(user.oders) ? (
                                        <OrderList orders={user.oders} status={activeOrdersMenu} />
                                    ) : (
                                        <p>Dữ liệu đơn hàng không hợp lệ.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeSidebar === 'settings' && (
                            <div>
                                <h2>Cài Đặt Người Dùng</h2>
                            </div>
                        )}
                        {activeSidebar === 'notifications' && (
                            <div>
                                <h2>Thông Báo</h2>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {isDialogOpen && (
                <Dialog
                    isOpen={isDialogOpen}
                    title="Nhập mật khẩu để chỉnh sửa"
                    onClose={() => setIsDialogOpen(false)}
                    onConfirm={handleEditConfirm}
                >
                    <input
                        type="password"
                        value={enteredPassword}
                        onChange={(e) => setEnteredPassword(e.target.value)}
                        placeholder="Mật khẩu"
                    />
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                </Dialog>
            )}
        </>
    );
};

export default User;
