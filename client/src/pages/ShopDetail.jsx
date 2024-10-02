import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../style/Pages/Shoppage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faStar, faComment, faUsers, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import Footer from './footer';

const ShopDetail = () => {
    const { Id } = useParams();
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchShopData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get('http://localhost:3000/Shops');
                const data = response.data;
                console.log('Dữ liệu đã lấy:', data);

                if (!Array.isArray(data)) {
                    throw new Error('Định dạng dữ liệu không hợp lệ: Dữ liệu không phải là mảng');
                }

                const shopId = parseInt(Id, 10);
                const foundShop = data.find((shop) => shop.idshop === shopId);

                if (!foundShop) {
                    throw new Error('Không tìm thấy cửa hàng với ID này');
                }

                setShop(foundShop);
            } catch (error) {
                setError(error.message || 'Lỗi khi lấy dữ liệu cửa hàng.');
            } finally {
                setLoading(false);
            }
        };

        fetchShopData();
    }, [Id]);

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>{error}</p>;
    if (!shop) return <p>Không có dữ liệu cửa hàng</p>;

    return (
        <div>
            <Header />
            <div className="infor-shoppage">
                <div className="row container">
                    <div className="col-md-3 text-center">
                        <div className="row">
                            <div className="col-4 image-shoppage">
                                <img src={shop.logo} alt={shop.name} className="img-fluid-shoppage" />
                            </div>
                            <div className="col name-shoppage">
                                <h1 className="mt-3">{shop.name}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9 px-5">
                        <div className="row">
                            <div className="col-6 title-shoppage">
                                <p>
                                    <FontAwesomeIcon icon={faStar} />
                                    <i className="fas fa-star"></i> Đánh giá: <span>{shop.rating}</span>
                                </p>
                            </div>
                            <div className="col-6 title-shoppage">
                                <p>
                                    <FontAwesomeIcon icon={faComment} />
                                    <i className="fas fa-comment-alt"></i> Nhận xét: <span>{shop.evaluate}</span>
                                </p>
                            </div>
                            <div className="col-6 title-shoppage">
                                <p>
                                    <FontAwesomeIcon icon={faCartShopping} />
                                    <i className="fas fa-shopping-cart"></i> Đã bán: <span>{shop.sold}</span>
                                </p>
                            </div>
                            <div className="col-6 title-shoppage">
                                <p>
                                    <FontAwesomeIcon icon={faUsers} />
                                    <i className="fas fa-users"></i> Số người theo dõi: <span>{shop.follower}</span>
                                </p>
                            </div>
                            <div className="col-6 title-shoppage">
                                <p>
                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                    <i className="fas fa-calendar-alt"></i> Ngày tham gia: <span>{shop.join}</span>
                                </p>
                            </div>
                            <div className="col-6 title-shoppage"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container my-4">
                <div className="AllProductShoppage">
                    <h4>Tất Cả Sản Phẩm:</h4>
                </div>
                <div className="row">
                    {shop.Product.map((product) => (
                        <div key={product['id-item']} className="col-3 mb-4">
                            <div className="product-item">
                                <div className="wsk-cp-product">
                                    <div className="wsk-cp-img">
                                        <img
                                            src={product['image-products'][0]}
                                            alt={product.titleproducts}
                                            className="card-img-top"
                                        />
                                    </div>
                                    <div className="wsk-cp-text">
                                        <div className="category">
                                            <span>{product.subCategory}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="wsm-cp-content">
                                    <div className="title-product">
                                        <h3>{product.titleproducts}</h3>
                                    </div>
                                    <div className="title-describe">
                                        <h3>{product.describe}</h3>
                                    </div>
                                </div>
                                <div className="row card-footer">
                                    <div className="col wsf-left">
                                        <div className="price">
                                            {product.colors[0] &&
                                                (() => {
                                                    const [firstColor, firstDetails] = Object.entries(
                                                        product.colors[0],
                                                    )[0];
                                                    return (
                                                        <div key={firstColor}>
                                                            {firstDetails.price.fakeprice && (
                                                                <span>{firstDetails.price.fakeprice} VNĐ</span>
                                                            )}
                                                            <p>{firstDetails.price.original} VNĐ</p>
                                                        </div>
                                                    );
                                                })()}
                                        </div>
                                    </div>
                                    <div className="col-3 wcf-right">
                                        <a href="#" className="buy-btn">
                                            <a className="icon" href="#">
                                                <FontAwesomeIcon icon={faCartShopping} />
                                            </a>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default ShopDetail;
