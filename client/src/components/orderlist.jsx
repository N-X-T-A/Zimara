import React from 'react';
import '../style/components/orderlist.css';

const statusTitleMap = {
    allOrders: 'Tất cả Đơn Hàng',
    pending: 'Chờ Xử Lý',
    'Đang Vận Chuyển': 'Vận Chuyển',
    completed: 'Hoàn Thành',
    canceled: 'Đã Hủy',
    shipping: 'Đang Vận Chuyển', // Thêm trạng thái mới
};

const statusClassMap = {
    pending: 'status-pending',
    'Đang Vận Chuyển': 'status-shipping',
    completed: 'status-completed',
    canceled: 'status-canceled',
    shipping: 'status-shipping', // Thêm lớp CSS cho trạng thái mới
};

const OrderList = ({ orders, status }) => {
    // Kiểm tra dữ liệu
    if (!Array.isArray(orders)) {
        return <p>Dữ liệu đơn hàng không hợp lệ.</p>;
    }

    // Nếu status là 'allOrders', hiển thị tất cả đơn hàng, ngược lại, chỉ lọc theo status
    const filteredOrders = status === 'allOrders' ? orders : orders.filter((order) => order.status === status);

    return (
        <div>
            {filteredOrders.length > 0 ? (
                <table className="order-table">
                    <thead>
                        <tr>
                            <th>ID Đơn Hàng</th>
                            <th>Cửa Hàng</th>
                            <th>Ảnh Sản Phẩm</th>
                            <th>Màu Sắc</th>
                            <th>Thanh Toán</th>
                            <th>Trạng Thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) =>
                            order.product.map((product, index) => {
                                const productColor = product.color[0];
                                const colorName = Object.keys(productColor)[0];

                                return (
                                    <tr key={`${order.odderid}-${index}`}>
                                        <td>#{order.odderid}</td>
                                        <td>{order.name}</td>
                                        <td>
                                            {product['image-products'] && product['image-products'][0] && (
                                                <img
                                                    src={product['image-products'][0]}
                                                    alt={`Sản phẩm ${product['id-item']}`}
                                                />
                                            )}
                                        </td>
                                        <td>{colorName}</td>
                                        <td>{productColor[colorName].price.fakeprice} VND</td>
                                        <td className={statusClassMap[order.status] || ''}>
                                            {statusTitleMap[order.status] || order.status}
                                        </td>
                                    </tr>
                                );
                            }),
                        )}
                    </tbody>
                </table>
            ) : (
                <p>Không có đơn hàng nào với trạng thái {status}.</p>
            )}
        </div>
    );
};

export default OrderList;
