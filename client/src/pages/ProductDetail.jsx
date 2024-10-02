import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ThumbnailSlider from '@/components/Thumnail';
import Header from '@/components/Header';
import '../style/Pages/ProductDetail.css';
import StarRating from '@/components/StartRatting';
import Loader from '../../src/components/loader/Loader';
import Footer from '../pages/footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [indexType, setIndexType] = useState(0);
    const [error, setError] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [value, setValue] = useState(1);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const newValue = parseInt(e.target.value);
        if (newValue >= 1 && newValue <= (selectedColorData ? selectedColorData.Quality : 0)) {
            setValue(newValue);
        }
    };

    const newType = (index) => {
        setIndexType(index);
    };

    const handleIncrement = () => {
        if (value < product.stock_quantity) {
            setValue(value + 1);
        }
    };

    const handleDecrement = () => {
        if (value > 1) {
            setValue(value - 1);
        }
    };

    useEffect(() => {
        if (!productId) {
            setError('Invalid product ID');
            return;
        }

        console.log('Fetching data for productId:', productId);
        fetch(`http://localhost:5000/api/product/` + `${productId}`)
            .then((response) => response.json())
            .then((data) => {
                setProduct(data.metadata);
            })
            .catch((error) => setError('Error fetching data: ' + error.message));
    }, [productId]);

    const handleColorClick = (color) => {
        setSelectedColor(color);
    };

    const handleAddToCart = (shopId, product, selectedClassification) => {
        try {
            let cartData = JSON.parse(localStorage.getItem('CartData')) || [];
            let shopIndex = cartData.findIndex((shop) => shop.shop_id === shopId);

            if (shopIndex !== -1) {
                let productIndex = cartData[shopIndex].Products.findIndex(
                    (p) =>
                        p.product_id === product.product_id &&
                        p.classification_name.join(',') === selectedClassification.join(','),
                );

                if (productIndex === -1) {
                    cartData[shopIndex].Products.push({
                        ...product,
                        classification_name: selectedClassification,
                    });
                }
            } else {
                cartData.push({
                    shop_id: shopId,
                    shop_name: product.shop_name,
                    Products: [
                        {
                            ...product,
                            classification_name: selectedClassification,
                        },
                    ],
                });
            }
            localStorage.setItem('CartData', JSON.stringify(cartData));
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
        } finally {
            toast.success('Thêm vào giỏ hàng thành công!', { theme: 'dark' });
        }
    };

    const handleBuyNow = () => {
        localStorage.setItem(`quantityCount_${product.id}`, value);
        localStorage.setItem(`cartPrice_${product.id}`, product.types[indexType].price);
        localStorage.setItem(`shopName_${product.id}`, product.shop.shop_name);
        localStorage.setItem(`productName_${product.id}`, product.name);
        localStorage.setItem(`productImage_${product.id}`, product.product_images[0]);
        localStorage.setItem(`classification_${product.id}`, product.types[indexType].name);
        navigate('/PlaceOrderPage');
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!product) {
        return <Loader />;
    }

    return (
        <>
            <Header />
            <p className="container mt-4 mb-4">Trang chủ &gt; {product.name} </p>
            <section className="container bg-white">
                <div class="row">
                    <div class="col-md-6">
                        <div class="p-3 text-white">
                            <ThumbnailSlider images={product.product_images} />
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-3 text-white">
                            <h1 className="fs-3 mb-3" style={{ color: 'black' }}>
                                {product.name}
                            </h1>
                            <div className="d-flex flex-row mb-4">
                                <StarRating rating={product.shop.rating} displayNumber={true} />
                                <p style={{ color: 'black' }} className="mx-4">
                                    {product.evaluate} Đánh Giá
                                </p>
                                <p style={{ color: 'black' }}>{product.selling} Sản Phẩm Đã Bán</p>
                            </div>
                            <div className="d-flex flex-row align-items-center mb-5">
                                <s style={{ marginRight: '45px', color: 'black' }} className="fs-5">
                                    {product.original_price.toLocaleString('vi-VN')}
                                </s>
                                <p style={{ color: '#0033a0' }} className="fs-3 fw-bold">
                                    {product.types[indexType].price.toLocaleString('vi-VN')}
                                </p>
                            </div>
                            <div className="features mt-5">
                                <div className="discountOffers d-flex mb-3">
                                    <p style={{ width: '110px', marginRight: '30px', color: 'black' }}>
                                        Mã giảm giá của shop
                                    </p>
                                    <p style={{ color: 'black' }}>DISCOUNT300</p>
                                </div>

                                <div className="discountOffers d-flex mb-3">
                                    <p style={{ width: '110px', marginRight: '30px', color: 'black' }}>
                                        Chính sách hoàn trả
                                    </p>
                                    <p style={{ color: 'black' }}>Trả hàng 15 ngày - Đổi hàng miễn phí</p>
                                </div>

                                <div className="discountOffers d-flex mb-3">
                                    <p style={{ width: '110px', marginRight: '30px', color: 'black' }}>Vận chuyển</p>
                                    <p style={{ color: 'black' }}>Vận chuyển tới Lạc Lâm, Đơn Dương, Lâm Đồng</p>
                                </div>

                                <div className="discountOffers d-flex mb-3">
                                    <p style={{ width: '110px', marginRight: '30px', color: 'black' }}>Phân loại</p>
                                    {product.types.map((type, index) => {
                                        const selected = index == indexType ? '#0033a0' : 'darkgray';
                                        return (
                                            <button
                                                className="btn-none"
                                                key={index}
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    color: `${selected}`,
                                                    padding: '5px 10px',
                                                    border: `2px solid ${selected}`,
                                                    marginRight: '10px',
                                                }}
                                                onClick={() => newType(index)}
                                            >
                                                {type.name}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="discountOffers d-flex mb-5">
                                    <p style={{ width: '110px', marginRight: '30px', color: 'black' }}>Số lượng</p>
                                    <button
                                        style={{ backgroundColor: 'lightgray', padding: '4px 10px', color: 'black' }}
                                        onClick={handleDecrement}
                                    >
                                        &mdash;
                                    </button>
                                    <input
                                        readOnly="true"
                                        type="text"
                                        value={value}
                                        onChange={handleChange}
                                        className="input"
                                        min="1"
                                        style={{
                                            backgroundColor: 'white',
                                            color: 'black',
                                            width: '50px',
                                            textAlign: 'center',
                                        }}
                                    />
                                    <button
                                        style={{ backgroundColor: 'lightgray', padding: '4px 10px', color: 'black' }}
                                        onClick={handleIncrement}
                                    >
                                        &#xff0b;
                                    </button>
                                    <p className="mx-3" style={{ color: 'black' }}>
                                        {product.stock_quantity} sản phẩm có sẵn
                                    </p>
                                </div>

                                <div className="pt-3 add-buy mt-3">
                                    <div className="d-flex justify-content-start">
                                        <div className=" m-1 add">
                                            <button
                                                onClick={() => {
                                                    handleAddToCart(
                                                        product.shop.id,
                                                        {
                                                            product_id: product.id,
                                                            name: product.name,
                                                            sale_price: product.types[indexType].price,
                                                            product_image: product.product_images[0],
                                                            stock: product.stock_quantity,
                                                            link_to_product: `/product/${product.id}`,
                                                            shop_name: product.shop.shop_name,
                                                            quantity: value,
                                                        },
                                                        [product.types[indexType].name],
                                                    );
                                                }}
                                                style={{
                                                    background: 'rgba(1,51,161,0.4)',
                                                    border: '2px solid #0033a0',
                                                    color: '#0033a0',
                                                    width: '230px',
                                                    height: '50px',
                                                    fontWeight: 'bold',
                                                    borderRadius: '3px',
                                                }}
                                            >
                                                Thêm Vào Giỏ Hàng
                                            </button>
                                            <ToastContainer />
                                        </div>
                                        <div className="m-1 buy">
                                            <button
                                                onClick={handleBuyNow}
                                                style={{
                                                    backgroundColor: '#0033a0',
                                                    color: 'white',
                                                    width: '200px',
                                                    height: '50px',
                                                    fontWeight: 'bold',
                                                    borderRadius: '3px',
                                                }}
                                            >
                                                Mua Ngay
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container bg-white mt-3 pt-3 pb-3">
                <div className="d-flex flex-row mx-2 align-items-center">
                    <img
                        src={product.shop.shop_image}
                        class="rounded-circle img-fluid"
                        style={{ width: '80px', height: '80px' }}
                    />

                    <div className="mx-5">
                        <div className="d-flex flex-row mb-2 align-items-center">
                            <p style={{ color: 'black' }}>{product.shop.shop_name}</p>
                            {product.shop.is_mall ? (
                                <div className="d-flex align-items-center">
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/768px-Twitter_Verified_Badge.svg.png"
                                        alt="Verified Badge"
                                        style={{
                                            width: '18px',
                                            height: '18px',
                                            borderRadius: '5px',
                                            marginLeft: '3px',
                                        }}
                                    />
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </div>

                        <div className="pt-1 add-buy">
                            <div className="d-flex justify-content-start">
                                <div className="add">
                                    <button
                                        onClick={handleAddToCart}
                                        style={{
                                            background: 'rgba(1,51,161,0.4)',
                                            border: '2px solid #0033a0',
                                            color: '#0033a0',
                                            fontWeight: 'bold',
                                            borderRadius: '3px',
                                            marginRight: '10px',
                                            padding: '0px 5px',
                                        }}
                                    >
                                        Chat Ngay
                                    </button>
                                </div>
                                <div className="buy">
                                    <button
                                        onClick={handleBuyNow}
                                        style={{
                                            backgroundColor: '#0033a0',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            borderRadius: '3px',
                                            border: '2px solid #0033a0',
                                            padding: '0px 5px',
                                        }}
                                    >
                                        Xem Shop
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mx-4">
                        <p style={{ color: 'black' }}>
                            Tham gia <span style={{ color: '#0033a0' }}>{product.shop.join_time}</span>
                        </p>
                        <p style={{ color: 'black' }}>
                            Người theo dõi{' '}
                            <span style={{ color: '#0033a0' }}>{product.shop.followers.toLocaleString('vi-VN')}</span>
                        </p>
                    </div>

                    <div className="mx-4">
                        <p style={{ color: 'black' }}>
                            Tỉ lệ phản hồi <span style={{ color: '#0033a0' }}>{product.shop.responseRate}%</span>
                        </p>
                        <p style={{ color: 'black' }}>
                            Đánh giá <span style={{ color: '#0033a0' }}>{product.shop.rating}</span>
                        </p>
                    </div>

                    <div className="mx-4">
                        <p style={{ color: 'black' }}>
                            Số sản phẩm <span style={{ color: '#0033a0' }}>{product.shop.products}</span>
                        </p>
                        <p style={{ color: 'black' }}>
                            Địa chỉ cửa hàng <span style={{ color: '#0033a0' }}>{product.shop.shipping_from}</span>
                        </p>
                    </div>
                </div>
            </section>

            <section className="container bg-white mt-3">
                <div className="p-3" dangerouslySetInnerHTML={{ __html: product.description }} />
            </section>

            <section className="container bg-white mt-3 px-4 pb-4">
                <h2 className="fs-5 pt-4 mb-3">ĐÁNH GIÁ SẢN PHẨM</h2>
                <div
                    className="average px-5 py-5 d-flex flex-row align-items-center"
                    style={{ background: 'rgba(1,51,161,0.1)' }}
                >
                    <div className="rating_average" style={{ marginRight: '50px' }}>
                        <span style={{ color: '#0033a0' }} className="fs-3 fw-bold">
                            4.9
                        </span>
                        <span> trên </span>
                        <span style={{ color: '#0033a0' }} className="fs-3">
                            5
                        </span>
                        <StarRating rating={product.average_rating} />
                    </div>

                    <div style={{ marginLeft: '100px' }}>
                        <button
                            style={{
                                background: 'rgba(1,51,161,0.1)',
                                border: '2px solid #0033a0',
                                color: '#0033a0',
                                fontWeight: 'bold',
                                borderRadius: '3px',
                                marginRight: '10px',
                                padding: '8px 50px',
                            }}
                        >
                            5 Sao
                        </button>
                        <button
                            style={{
                                background: 'rgba(1,51,161,0.1)',
                                border: '2px solid #0033a0',
                                color: '#0033a0',
                                fontWeight: 'bold',
                                borderRadius: '3px',
                                marginRight: '10px',
                                padding: '8px 50px',
                            }}
                        >
                            4 Sao
                        </button>
                        <button
                            style={{
                                background: 'rgba(1,51,161,0.1)',
                                border: '2px solid #0033a0',
                                color: '#0033a0',
                                fontWeight: 'bold',
                                borderRadius: '3px',
                                marginRight: '10px',
                                padding: '8px 50px',
                            }}
                        >
                            3 Sao
                        </button>
                        <button
                            style={{
                                background: 'rgba(1,51,161,0.1)',
                                border: '2px solid #0033a0',
                                color: '#0033a0',
                                fontWeight: 'bold',
                                borderRadius: '3px',
                                marginRight: '10px',
                                padding: '8px 50px',
                            }}
                        >
                            2 Sao
                        </button>
                        <button
                            style={{
                                background: 'rgba(1,51,161,0.1)',
                                border: '2px solid #0033a0',
                                color: '#0033a0',
                                fontWeight: 'bold',
                                borderRadius: '3px',
                                marginRight: '10px',
                                padding: '8px 50px',
                            }}
                        >
                            1 Sao
                        </button>
                    </div>
                </div>
                <div className="list_ratings  mt-4">
                    {product.commends.map((commend) => {
                        return (
                            <>
                                <div className="row mt-5">
                                    <div className="col-md-1">
                                        <img
                                            class="rounded-circle img-fluid"
                                            style={{ width: '50px', height: '50px' }}
                                            src={commend.commend.user.photo_url}
                                        />
                                    </div>
                                    <div className="col-md-10">
                                        <p className="fs-7">{commend.commend.user.name}</p>
                                        <StarRating rating={commend.commend.user.rating} />
                                        <p className="mt-3 mb-4">{commend.commend.user.content}</p>
                                        {commend.commend.user.images.map((image) => {
                                            return <img style={{ width: '150px' }} src={image} />;
                                        })}
                                        <div className="reply mt-4 px-2 py-2" style={{ backgroundColor: '#f4f4f5' }}>
                                            <p className="mb-2">{product.shop.shop_name}</p>
                                            <p>{commend.commend.seller.feedback}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        );
                    })}
                </div>
            </section>

            <Footer />
        </>
    );
};

export default ProductDetail;
