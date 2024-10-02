import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/loader/Loader';
import '../style/purchase.css';
import { BadgeCheck } from 'iconoir-react';
import CartState from './CartState';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const fetchShopsFromCart = () => {
            try {
                const cartData = JSON.parse(localStorage.getItem("CartData")) || [];
                if (cartData.length === 0) {
                    setShops([]);
                    return;
                }
                const shops = cartData.map(shop => ({
                    shop_id: shop.shop_id,
                    shop_name: shop.shop_name,
                    Products: shop.Products,
                }));
    
                setShops(shops);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchShopsFromCart();
    }, []);
    

    const deleteProduct = (shopId, productId) => {
        const updatedShops = shops
            .map((shop) => {
                if (shop.shop_id === shopId) {
                    const updatedProducts = shop.Products.filter((product) => product.product_id !== productId);
                    if (updatedProducts.length === 0) {
                        return null;
                    }
                    return { ...shop, Products: updatedProducts };
                }
                return shop;
            })
            .filter((shop) => shop !== null);

        const cartData = JSON.parse(localStorage.getItem("CartData")) || [];
        const updatedCartData = cartData
            .map((shop) => {
                if (shop.shop_id === shopId) {
                    const updatedProducts = shop.Products.filter((product) => product.product_id !== productId);
                    if (updatedProducts.length === 0) {
                        return null;
                    }
                    return { ...shop, Products: updatedProducts };
                }
                return shop;
            })
            .filter((shop) => shop !== null);
        localStorage.setItem("CartData", JSON.stringify(updatedCartData));
        localStorage.removeItem(`quantityCount_${productId}`);
        localStorage.removeItem(`cartPrice_${productId}`);
        localStorage.removeItem(`${productId}`);
        setShops(updatedShops);
        ToTalPriceCalculation();
    };
    
    
    

    const toggleLocalStorageItem = (key) => {
        const isChecked = JSON.parse(localStorage.getItem(key)) || false;
        localStorage.setItem(key, !isChecked);
    };

    const handleCheckboxChange = (itemId, isFather) => {
        if (isFather) {
            shops.forEach((shop) => {
                shop.Products.forEach((product) => {
                    if (!localStorage.getItem(product.product_id)) {
                        toggleLocalStorageItem(product.product_id);
                    } else if (localStorage.getItem(product.product_id)) {
                        toggleLocalStorageItem(product.product_id);
                    } else {
                        toggleLocalStorageItem(product.product_id);
                    }
                });
            });
        } else {
            toggleLocalStorageItem(itemId);
        }

        ToTalPriceCalculation();
    };

    const ToTalPriceCalculation = () => {
        let total = 0;
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith('cartPrice_')) {
                const itemId = key.split('_')[1];
                const isChecked = JSON.parse(localStorage.getItem(`${itemId}`));

                if (isChecked) {
                    const itemPrice = parseInt(localStorage.getItem(key), 10) || 0;
                    total += itemPrice;
                }
            }
        });

        setTotalPrice(total);
    };

    useEffect(() => {
        ToTalPriceCalculation();
    }, [shops]);

    const deleteAllProduct = () => {
        setShops([]);
        localStorage.clear();
        setTotalPrice(0);
    };
    if (loading) {
        return <Loader />;
    }
    if (error) {
        return <div className="fs-1 fw-bold">{error}</div>;
    }
    return (
        <>
            <header style={{padding:'20px 30px', boxShadow:'none'}} className="header container-sm">
                <div class="mt-4 mb-4">
                    <div class="row">
                        <div class="col d-flex align-items-center">
                            <a className="reset_a" href="/">
                                <div class="logo d-flex align-items-center justify-content-center">
                                <strong className="logo">
                                    <a href="/">
                                        <img style={{width:'40px'}} src="/images/logo_2.png" alt="" />
                                    </a>
                                </strong>
                                    <div className="divider h2">|</div>
                                    <div className="text-center h3 m-0">Giỏ hàng</div>
                                </div>
                            </a>
                        </div>
                        <div class="col">
                            <div class="search">
                                <i class="fa fa-search"></i>
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Tìm sản phẩm, thương hiệu, và tên shop"
                                />
                                <button class="btn btn-primary">Tìm kiếm</button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <body className="body">
                <section class="heading-title my-4 container">
                    <div className="heading-title-content  py-3 px-4 rounded shadow-sm">
                        <ul class="row list-unstyled align-items-center pt-4 pb-4">
                            <li class="col">
                                <div class="z_checkbox px-3">
                                    <label class="form-check-label" for="check_buy_all">
                                        Sản phẩm
                                    </label>
                                </div>
                            </li>
                            <div class="col">
                                <ul class="row list-unstyled heading-title-item">
                                    <li class="col text-center">Đơn Giá</li>
                                    <li class="col text-center">Số Lượng</li>
                                    <li class="col text-center">Số Tiền</li>
                                    <li class="col text-center">Thao Tác</li>
                                </ul>
                            </div>
                        </ul>
                    </div>
                </section>
                <section className="list_items_in_cart container">
                    {shops.map((shop) => (
                        <div className="item_in_cart  py-3 px-4 rounded shadow-sm">
                            <ul class="row list-unstyled align-items-center pt-4 pb-4">
                                <li class="col">
                                    <div class="z_checkbox  px-3">
                                        <input
                                            class="check-input"
                                            type="checkbox"
                                            id="buy_all_in_shop"
                                            name="check_buy_all"
                                            value="buy_all"
                                        />
                                        <a href={shop.link_to_shop} class="reset_a">
                                            <label
                                                class="form-check-label d-flex align-items-center reset_a"
                                                for="check_buy_all"
                                            >
                                                {shop.shop_name}{' '}
                                                <img
                                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/768px-Twitter_Verified_Badge.svg.png"
                                                    alt="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/768px-Twitter_Verified_Badge.svg.png"
                                                    style={{
                                                        width: '18px',
                                                        height: '18px',
                                                        borderRadius: '5px',
                                                        marginLeft: '3px',
                                                    }}
                                                />
                                            </label>
                                        </a>
                                    </div>
                                </li>
                            </ul>
                            <div className="list_items_in_shop">
                                {shop.Products.map((item, index) => {
                                    const isLastElement = index === shop.Products.length - 1;

                                    return (
                                        <>
                                            <ul class="item_in_shop row list-unstyled align-items-center pt-3">
                                                <li class="col">
                                                    <div class="z_checkbox px-3">
                                                        <input
                                                            class="check-input"
                                                            type="checkbox"
                                                            id="buy_this_product"
                                                            name="check_buy_all"
                                                            value="buy_all"
                                                            checked={
                                                                localStorage.getItem(`${item.product_id}`) === 'true'
                                                            }
                                                            onChange={(e) => {
                                                                handleCheckboxChange(item.product_id);
                                                                if (e.target.checked) {
                                                                    localStorage.setItem(
                                                                        `shopName_${item.product_id}`,
                                                                        shop.shop_name,
                                                                    );
                                                                    localStorage.setItem(
                                                                        `productName_${item.product_id}`,
                                                                        item.name,
                                                                    );
                                                                    localStorage.setItem(
                                                                        `productImage_${item.product_id}`,
                                                                        item.product_image,
                                                                    );
                                                                    localStorage.setItem(
                                                                        `classification_${item.product_id}`,
                                                                        item.classification_name.join(', '),
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                        <a href={item.link_to_product} class="w-100 reset_a">
                                                            <div className="product-information d-flex align-items-center w-100 p-3 border rounded shadow-sm">
                                                                <img
                                                                    src={item.product_image}
                                                                    alt={item.name}
                                                                    className="img-fluid me-3"
                                                                    style={{
                                                                        maxWidth: '100px',
                                                                        height: 'auto',
                                                                        borderRadius: '5px',
                                                                    }}
                                                                />
                                                                <div className="col">
                                                                    <p className="mb-0 text-dark name_product">
                                                                        {item.name}
                                                                    </p>
                                                                    <p className="mb-0 classification">
                                                                        {item.classification_name.join(', ')}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </div>
                                                </li>
                                                <div class="col">
                                                    <ul class="row list-unstyled">
                                                        <li class="col text-center price">
                                                            {item.sale_price.toLocaleString('vi-VN')}
                                                        </li>
                                                        <CartState
                                                            id={item.product_id}
                                                            o_price={item.sale_price}
                                                            stock={item.stock}
                                                            preCount={item.quantity}
                                                        />
                                                        <li class="col text-center action d-flex flex-column">
                                                            <button
                                                                className="remove_btn mb-2"
                                                                onClick={() =>
                                                                    deleteProduct(shop.shop_id, item.product_id)
                                                                }
                                                            >
                                                                Xóa
                                                            </button>
                                                            <button className="button_with_p_color">
                                                                Tìm sản phẩm tương tự
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </ul>

                                            {!isLastElement ? (
                                                <div className="divider_in_row mt-4 mb-2"></div>
                                            ) : (
                                                <div></div>
                                            )}
                                        </>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </section>
                <section class="total_order_value container pt-4">
                    <div class="bg-white py-3 px-4 rounded shadow-sm">
                        <div class="row mb-4">
                            <div class="col-md-6">Nhập mã giảm giá (nếu có) ở bước thanh toán</div>
                            <div class="col-md-6 text-end fs-5">
                                Tổng đơn hàng:{' '}
                                <span class="total_price fw-bold">₫{totalPrice.toLocaleString('vi-VN')}</span>
                            </div>
                        </div>
                        <div className="divider_dotted_row"></div>
                        <div class="row">
                            <div class="col-md-6 d-flex align-items-center">
                                <div class="z_checkbox px-3">
                                    <input
                                        class="check-input"
                                        type="checkbox"
                                        id="buy_all"
                                        name="check_buy_all"
                                        value="buy_all"
                                        onChange={() => {
                                            handleCheckboxChange(1, true);
                                        }}
                                    />
                                    <label class="form-check-label" for="check_buy_all">
                                        Chọn tất cả
                                    </label>
                                </div>
                                <button className="remove_btn remove_all_btn px-5" onClick={() => deleteAllProduct()}>
                                    Xóa tất cả sản phẩm
                                </button>
                            </div>
                            <div class="col-md-6 text-end mt-3 mb-3">
                                <Link class="purchase_btn reset_a" to="/PlaceOrderPage">
                                    Tiến hành thanh toán
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </body>
        </>
    );
};
export default CartPage;
