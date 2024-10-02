import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import '../style/components/FlashSale.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Time from './Time';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCartShopping } from '@fortawesome/free-solid-svg-icons';

const FlashSale = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await axios.get('http://localhost:3000/Shops');
                setShops(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchShops();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: true,
    };

    return (
        <div className="container mt-5">
            <div className="title-deal mt-4 mb-4">
                <div className="ps-3 d-flex align-items-center">
                    <div className="text-FlashSale fs-4 fw-bold" style={{ marginRight: '20px' }}>
                        <img
                            style={{ width: '100px' }}
                            src="https://sadewapulsa.com/wp-content/uploads/2018/05/flash-sale-png.png"
                        />
                    </div>
                    <div className="fs-5">
                        <Time initialTime={12000} />{' '}
                    </div>
                </div>
            </div>
            <Slider {...settings}>
                {shops.flatMap((shop) =>
                    shop.Product.filter((product) => product.badge === 'Sale').map((product) => (
                        <div style={{ backgroundColor: 'white' }} className="row px-2 py-2">
                            <a
                                className="d-flex align-items-center flex-column"
                                href={`/product/${product['id-item']}`}
                            >
                                <div className="col-md-7" style={{ width: '262px', position: 'relative' }}>
                                    <img
                                        style={{ width: '100%' }}
                                        src={product['image-products'][0]}
                                        alt={product.titleproducts}
                                    />
                                    <div
                                        className="fw-bold"
                                        style={{
                                            position: 'absolute',
                                            top: '0px',
                                            right: '0px',
                                            background: 'rgba(1,51,161,0.1)',
                                            padding: '2px 4px',
                                            color: '#0033a0',
                                        }}
                                    >
                                        -50%
                                    </div>
                                </div>

                                <div
                                    className="col-md-3 mb-2 px-2 py-2"
                                    style={{ backgroundColor: 'white', width: '99.5%' }}
                                >
                                    {product.describe.length > 30
                                        ? `${product.describe.substring(0, 30)}...`
                                        : product.describe}
                                    <div className="row mt-2 mb-2">
                                        <p className="col main_color fw-bold">30.000.000</p>
                                        <p className="col">30k đã bán</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    )),
                )}
            </Slider>
        </div>
    );
};

export default FlashSale;
