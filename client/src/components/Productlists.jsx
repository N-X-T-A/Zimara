import React, { useEffect, useState } from 'react';
import '../style/Pages/productlist.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import Loader from '../components/loader/Loader';
const ListProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchAllProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get('http://localhost:5000/api/product/');
                setProducts(response.data.metadata);
            } catch (error) {
                setError(error.message || 'Lỗi khi lấy dữ liệu sản phẩm.');
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:3000/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh mục:', error);
            }
        };

        fetchAllProducts();
        fetchCategories();
    }, []);

    if (loading) return <Loader />;
    if (error) return <p>{error}</p>;

    if (products.length === 0) return <p>Không có sản phẩm để hiển thị</p>;

    return (
        <>
            <div className="container mt-5">
                <div className="title-deal mt-4 mb-5">
                    <div className="row ps-3 d-flex align-items-center">
                        <div className="col-md-2 text-FlashSale fs-4 fw-bold" style={{ width: '100%' }}>
                            <h4 className="text-center">Gợi ý hôm nay</h4>
                        </div>
                    </div>
                </div>

                <div className="product-list mb-5">
                    <div className="container">
                        <div className="row product-grid gap-5">
                            {products.map((product) => (
                                <div style={{ backgroundColor: 'white', width: '262px' }} className="col-md-2">
                                    <a
                                        className="d-flex align-items-center flex-column"
                                        href={`/product/${product.id}`}
                                    >
                                        <div className="col-md-7" style={{ position: 'relative', width: '100%' }}>
                                            <img style={{ width: '100%' }} src={product.product_images} />
                                            <div
                                                className="fw-bold"
                                                style={{
                                                    position: 'absolute',
                                                    top: '0px',
                                                    right: '-12px',
                                                    background: 'rgba(1,51,161,0.1)',
                                                    padding: '2px 4px',
                                                    color: '#0033a0',
                                                }}
                                            >
                                                -50%
                                            </div>
                                        </div>

                                        <div
                                            className="col-md-3 mb-2"
                                            style={{ backgroundColor: 'white', width: '99.5%' }}
                                        >
                                            <p>{product.name}</p>
                                            <div className="row mt-2 mb-2">
                                                <p className="col main_color fw-bold">
                                                    {product.sale_price.toLocaleString('vi-VN')}
                                                </p>
                                                <p className="col">30k đã bán</p>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                        <button
                            className="mt-5"
                            style={{
                                display: 'block',
                                margin: '0px auto',
                                border: '2px solid lightgrey',
                                padding: '8px 16px',
                            }}
                        >
                            Xem thêm
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ListProduct;
