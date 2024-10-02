// src/components/ShopList.jsx
import React, { useEffect, useState } from 'react';

const ShopList = () => {
    const [shops, setShops] = useState([]);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await fetch('http://localhost:5173/Shops'); // API địa phương
                const data = await response.json();
                setShops(data.Shops);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu từ Shops:', error);
            }
        };

        fetchShops();
    }, []);

    return (
        <div>
            <h1>Danh sách cửa hàng</h1>
            {shops.map((shop) => (
                <div key={shop.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                    {/* Hiển thị thông tin của từng shop */}
                    <img src={shop.logo} alt={shop.name} style={{ width: '80px', height: '80px' }} />
                    <h2>{shop.name}</h2>
                    <p>
                        <strong>ID Shop:</strong> {shop.id}
                    </p>{' '}
                    {/* Hiển thị ID của shop */}
                    <p>
                        <strong>Rating:</strong> {shop.rating}
                    </p>
                    <p>
                        <strong>Followers:</strong> {shop.follower}
                    </p>
                    <p>
                        <strong>Tham gia:</strong> {shop.join}
                    </p>
                    <h3>Sản phẩm</h3>
                    {shop.Product.map((product) => (
                        <div key={product['id-item']} style={{ paddingLeft: '20px' }}>
                            <h4>{product.titleproducts}</h4>
                            <p>{product.describe}</p>
                            <div>
                                {product['image-products'].map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={product.titleproducts}
                                        style={{ width: '100px', marginRight: '10px' }}
                                    />
                                ))}
                            </div>
                            <div>
                                {Object.entries(product.colors[0]).map(([color, info]) => (
                                    <div key={color}>
                                        <p>
                                            <strong>Màu:</strong> {color}
                                        </p>
                                        <p>
                                            <strong>Giá gốc:</strong> {info.price.original}
                                        </p>
                                        <p>
                                            <strong>Giá giảm:</strong> {info.price.discounted}
                                        </p>
                                        <p>
                                            <strong>Chất lượng:</strong> {info.Quality}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ShopList;
