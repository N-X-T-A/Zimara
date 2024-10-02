import { useEffect, useState } from 'react';
import '../style/purchase.css';
import { MapPin } from 'iconoir-react';
import { Link } from 'react-router-dom';
import Loader from '../components/loader/Loader';

const PlaceOrderPage = () => {
    const [formattedData, setFormattedData] = useState([]);
    const [totalPurchase, setTotalPurchase] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [coupon, setCoupon] = useState('');
    const [shippingOption, setShippingOption] = useState('GHTK');
    const [discount, setDiscount] = useState(0);

    const handleApplyCoupon = () => {
        if (coupon === 'DISCOUNT300') {
            setDiscount(300000);
        } else {
            alert('Mã giảm giá không hợp lệ.');
        }
    };

    const handlePurchase = () => {
        let formattedData = [];
        let totalPurchase = 0;
        let totalProducts = 0;

        Object.keys(localStorage).forEach((key) => {
            // Cập nhật regex để khớp với chuỗi ký tự sau dấu gạch dưới (_)
            let match = key.match(/quantityCount_([a-zA-Z0-9]+)/);
            if (match) {
                let uniqueId = match[1]; // Lấy chuỗi ID sau quantityCount_

                // Lấy các giá trị từ localStorage dựa trên uniqueId
                let quantityCount = localStorage[`quantityCount_${uniqueId}`];
                let cartPrice = localStorage[`cartPrice_${uniqueId}`];
                let shopName = localStorage[`shopName_${uniqueId}`];
                let productName = localStorage[`productName_${uniqueId}`];
                let productImage = localStorage[`productImage_${uniqueId}`];
                let classification = localStorage[`classification_${uniqueId}`];

                // Kiểm tra nếu sản phẩm tồn tại trong giỏ và có số lượng cũng như giá hợp lệ
                if (localStorage[uniqueId] === 'true' && quantityCount && cartPrice) {
                    totalPurchase += parseInt(cartPrice);
                    totalProducts += 1;

                    let itemData = {
                        id: uniqueId,
                        name: productName,
                        image: productImage,
                        classification_name: classification,
                        quantityCount: quantityCount,
                        totalPrice: cartPrice,
                    };

                    // Tìm shop theo tên trong formattedData
                    let shopIndex = formattedData.findIndex((shop) => shop.shop_name === shopName);

                    if (shopIndex !== -1) {
                        // Nếu shop đã tồn tại, thêm sản phẩm vào shop đó
                        formattedData[shopIndex].Products.push(itemData);
                    } else {
                        // Nếu shop chưa tồn tại, thêm shop mới vào formattedData
                        formattedData.push({
                            shop_name: shopName,
                            Products: [itemData],
                        });
                    }
                }
            }
        });

        // Cập nhật state với tổng số sản phẩm và tổng tiền
        setTotalProducts(totalProducts);
        setTotalPurchase(totalPurchase);
        setFormattedData(formattedData);
    };

    useEffect(() => {
        handlePurchase();
    }, []);

    return (
        <>
            <header style={{ padding: '20px 30px', boxShadow: 'none' }} className="header container-sm">
                <div class="mt-4 mb-4">
                    <div class="row">
                        <div class="col d-flex align-items-center">
                            <a className="reset_a" href="/">
                                <div class="logo d-flex align-items-center justify-content-center">
                                    <strong className="logo">
                                        <a href="/">
                                            <img style={{ width: '40px' }} src="/images/logo_2.png" alt="" />
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
                <section className="heading-title my-4 container">
                    <div class="heading-title-content px-4 pt-3 pb-3 py-3 px-4 rounded shadow-sm">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="p_color h5">
                                    <MapPin /> Địa chỉ nhận hàng
                                </div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-3">
                                <div class="fw-bold customer_name">Nguyễn Tân Tiến - 0325996645</div>
                            </div>
                            <div class="col-md-6">
                                <div class="customer_address">
                                    Số 192, tổ 7, thôn Xuân Thượng, xã Lạc Lâm, huyện Đơn Dương, tỉnh Lâm Đồng
                                </div>
                            </div>
                            <div class="col-md-3 d-flex justify-content-end">
                                <div class="customer_manipulate">
                                    <button
                                        className="button_with_p_color"
                                        onClick={() => {
                                            alert(JSON.stringify(formattedData));
                                        }}
                                    >
                                        Đổi địa chỉ khác
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

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
                                    <li class="col text-center">Thành Tiền</li>
                                </ul>
                            </div>
                        </ul>
                    </div>
                </section>

                <section className="list_items_in_cart container">
                    {formattedData.map((shop) => (
                        <div className="item_in_cart  py-3 px-4 rounded shadow-sm">
                            <ul class="row list-unstyled align-items-center pt-4 pb-4">
                                <li class="col">
                                    <div class="z_checkbox  px-3">
                                        <a class="reset_a">
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
                                                        <a class="w-100 reset_a">
                                                            <div className="product-information d-flex align-items-center w-100 p-3 border rounded shadow-sm">
                                                                <img
                                                                    src={item.image}
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
                                                                        {item.classification_name}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </div>
                                                </li>
                                                <div class="col">
                                                    <ul class="row list-unstyled">
                                                        <li class="col text-center price">
                                                            {(item.totalPrice / item.quantityCount).toLocaleString(
                                                                'vi-VN',
                                                            )}{' '}
                                                            ₫
                                                        </li>
                                                        <li class="col text-center ">{item.quantityCount}</li>
                                                        <li class="col text-center total_price">
                                                            {parseInt(item.totalPrice).toLocaleString('vi-VN')} ₫
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

                <section className="total_order_value container">
                    <div className="container mt-4 bg-white py-3 px-4 rounded shadow-sm">
                        <h4 className="fs-5 mt-3 mb-4">Phương thức thanh toán</h4>
                        <div className="btn-group mb-4" role="group" aria-label="Payment methods">
                            <button
                                type="button"
                                className={`btn_outline ${paymentMethod === 'COD' ? 'on_active' : ''}`}
                                onClick={() => setPaymentMethod('COD')}
                            >
                                Thanh toán khi nhận hàng
                            </button>
                            <button type="button" className={`deactive`} onClick={() => setPaymentMethod('Bank')}>
                                Chuyển khoản ngân hàng
                            </button>
                            <button type="button" className={`deactive`} onClick={() => setPaymentMethod('CreditCard')}>
                                Thẻ Tín dụng/Ghi nợ
                            </button>
                            <button
                                type="button"
                                className={`btn_outline ${paymentMethod === 'Paypal' ? 'on_active' : ''}`}
                                onClick={() => setPaymentMethod('Paypal')}
                            >
                                Paypal
                            </button>
                            <button type="button" className={`deactive`} onClick={() => setPaymentMethod('NAPAS')}>
                                Thẻ nội địa NAPAS
                            </button>
                        </div>

                        <div className="border p-3 rounded">
                            <h5>Thanh toán khi nhận hàng</h5>
                            <p>Phí thu hộ: 0 VNĐ. Ưu đãi về phí vận chuyển (nếu có) áp dụng cả với phí thu hộ.</p>
                        </div>

                        {/* Chọn đơn vị vận chuyển */}
                        <div className="mt-4">
                            <h5 className="fs-5 mt-3 mb-4">Đơn vị vận chuyển</h5>
                            <select
                                className="form-select z_padding"
                                value={shippingOption}
                                onChange={(e) => setShippingOption(e.target.value)}
                            >
                                <option value="GHTK">Giao hàng tiết kiệm</option>
                                <option value="GHN">Giao hàng nhanh</option>
                                <option value="VTP">Viettel Post</option>
                            </select>
                        </div>

                        {/* Mã giảm giá */}
                        <div className="mt-4">
                            <h5 className="fs-5 mt-3 mb-4">Mã giảm giá</h5>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập mã giảm giá"
                                    value={coupon}
                                    onChange={(e) => setCoupon(e.target.value)}
                                />
                                <button
                                    className="btn btn-primary purchase_btn text-center px-5"
                                    onClick={handleApplyCoupon}
                                >
                                    Áp dụng
                                </button>
                            </div>
                        </div>

                        <div className="mt-4">
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td>Tổng tiền hàng</td>
                                        <td className="text-end">{totalPurchase.toLocaleString('vi-VN')} ₫</td>
                                    </tr>
                                    <tr>
                                        <td>Phí vận chuyển</td>
                                        <td className="text-end">41.900 ₫</td>
                                    </tr>
                                    <tr>
                                        <td>Tổng cộng Voucher giảm giá</td>
                                        <td className="text-end">-{discount.toLocaleString()} ₫</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Tổng thanh toán</th>
                                        <th className="text-end text-danger total_price fs-5">
                                            {(totalPurchase + 41900 - discount).toLocaleString('vi-VN')} ₫
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="row">
                            <div class="col-md-6 d-flex align-items-center">
                                Nhấn "Xác nhận đặt hàng" đồng nghĩa với việc bạn chấp nhận Điều khoản{' '}
                                <a href="" className="px-1">
                                    Zimara
                                </a>
                            </div>
                            <div class="col-md-6 text-end mt-3 mb-3">
                                <Link class="btn btn-primary purchase_btn reset_a" to="/user/10000000002">
                                    Xác nhận đặt hàng
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </body>
        </>
    );
};

export default PlaceOrderPage;
