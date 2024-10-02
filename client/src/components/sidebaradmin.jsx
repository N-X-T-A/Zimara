import React from 'react';
import { Link } from 'react-router-dom';

const Sidebaradmin = () => {
    const [activeSidebar, setActiveSidebar] = useState('overview'); // Default state

    return (
        <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
            <div className="position-sticky">
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeSidebar === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveSidebar('overview')}
                        >
                            Tổng quan
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeSidebar === 'add-product' ? 'active' : ''}`}
                            onClick={() => setActiveSidebar('add-product')}
                        >
                            Thêm Sản Phẩm
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeSidebar === 'sales' ? 'active' : ''}`}
                            onClick={() => setActiveSidebar('sales')}
                        >
                            Doanh Số
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeSidebar === 'order' ? 'active' : ''}`}
                            onClick={() => setActiveSidebar('order')}
                        >
                            Đơn Hàng
                        </button>
                    </li>
                    <li className="nav-item">
                        <h5>Chọn cửa hàng</h5>
                        <ul className="nav flex-column">
                            {shops.length > 0 ? (
                                shops.map((shop) => (
                                    <li key={shop.id} className="nav-item">
                                        <button className="nav-link" onClick={() => onShopSelect(shop.id)}>
                                            {shop.name}
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li className="nav-item">Không có cửa hàng nào</li>
                            )}
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Sidebaradmin;
