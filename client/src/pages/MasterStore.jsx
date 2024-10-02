import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Pages/MasterStore.css';
import DragAndDropImage from '../components/DragAndDropImage';
import PieChart from '../components/Chart/PieChart';
import numberToWordsVi from '../components/numberToWordsVi';
import BarChart from '../components/Chart/LineChart';

const MasterStore = () => {
    const { Id } = useParams();
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSidebar, setActiveSidebar] = useState('overview');
    const [showAddDealModal, setShowAddDealModal] = useState(false);
    const [productEditData, setProductEditData] = useState(null);
    const [showEditProductModal, setShowEditProductModal] = useState(false);
    const [editData, setEditData] = useState({
        rating: '',
        evaluate: '',
        sold: '',
        follower: '',
        join: '',
    });
    const [newDeal, setNewDeal] = useState('');
    const [currentProduct, setCurrentProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        title: '',
        description: '',
        image: '',
        colors: [
            {
                color: '',
                priceOriginal: '',
                pricefakeprice: '',
                quantity: '',
            },
        ],
    });
    const [selectedSpecification, setSelectedSpecification] = useState('ts1');
    const [placeholder, setPlaceholder] = useState('Màu sắc');

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
                setEditData({
                    rating: foundShop.rating,
                    evaluate: foundShop.evaluate,
                    sold: foundShop.sold,
                    follower: foundShop.follower,
                    join: foundShop.join,
                });
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

    const handleAddDealShow = () => setShowAddDealModal(true);
    const handleAddDealClose = () => setShowAddDealModal(false);

    const handleEditProductShow = (product) => {
        setProductEditData({
            title: product.titleproducts,
            description: product.describe,
            colors: Object.entries(product.colors[0]).map(([color, details]) => ({
                color,
                priceOriginal: details.price.original,
                pricefakeprice: details.price.fakeprice,
                quantity: details.Quality,
            })),
        });
        setShowEditProductModal(true);
    };

    const handleProductInputChange = (e, colorIndex) => {
        const { name, value } = e.target;
        setProductEditData((prevData) => {
            const updatedColors = [...prevData.colors];
            updatedColors[colorIndex] = {
                ...updatedColors[colorIndex],
                [name]: value,
            };
            return { ...prevData, colors: updatedColors };
        });
    };

    const handleAddDeal = () => {
        if (newDeal) {
            setShop((prevShop) => ({
                ...prevShop,
                Deals: [...prevShop.Deals, newDeal],
            }));
            setNewDeal('');
            handleAddDealClose();
        }
    };

    const handleSaveProductChanges = () => {
        console.log('Updated product data:', productEditData);
        setShowEditProductModal(false);
    };

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleColorChange = (e, index) => {
        const { name, value } = e.target;
        const newColors = [...newProduct.colors];
        newColors[index] = {
            ...newColors[index],
            [name]: value,
        };
        setNewProduct((prevState) => ({
            ...prevState,
            colors: newColors,
        }));
    };

    const handleAddColor = () => {
        setNewProduct((prevState) => ({
            ...prevState,
            colors: [...prevState.colors, { color: '', priceOriginal: '', priceDiscounted: '', quantity: '' }],
        }));
    };

    const handleAddProduct = () => {
        if (shop) {
            const updatedProducts = [...shop.Product, newProduct];
            setShop({ ...shop, Product: updatedProducts });
            setNewProduct({
                titleproducts: '',
                describe: '',
                image: '',
                colors: [
                    {
                        color: '',
                        priceOriginal: '',
                        priceDiscounted: '',
                        quantity: '',
                    },
                ],
            });
        }
        console.log('Sản phẩm đã thêm:', newProduct);
    };

    const handleSpecificationChange = (event) => {
        const value = event.target.value;
        setSelectedSpecification(value);
        setPlaceholder(value === 'ts1' ? 'Màu sắc' : 'Kích thước');
    };

    const totalStoreRevenue = shop.Product.reduce((acc, product) => {
        // Duyệt qua từng sản phẩm và màu sắc để tính doanh thu
        const totalRevenue = product.colors[0]
            ? Object.entries(product.colors[0]).reduce((productAcc, [color, details]) => {
                  const originalPrice = parseFloat(details.price.original.replace(/[\.,]/g, '')); // Chuyển đổi giá sang dạng số
                  const sold = parseInt(details.sold, 10); // Lấy số lượng đã bán
                  const returns = parseInt(details.return, 10); // Lấy số lượng trả lại
                  const revenue = originalPrice * (sold - returns); // Tính doanh thu = original * (sold - return)
                  return productAcc + revenue; // Cộng doanh thu từng màu vào tổng doanh thu của sản phẩm
              }, 0)
            : 0;

        return acc + totalRevenue; // Cộng doanh thu từng sản phẩm vào tổng doanh thu cửa hàng
    }, 0);

    const totalStoreRevenueInWords = numberToWordsVi(totalStoreRevenue);

    return (
        <div>
            {/* <Header /> */}
            <div className="container-fluid">
                <div className="row">
                    <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block bg-light sidebar-ms">
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

                                {/* <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeSidebar === 'order' ? 'active' : ''}`}
                                        onClick={() => setActiveSidebar('order')}
                                    >
                                        Đơn Hàng
                                    </button>
                                </li> */}
                            </ul>
                        </div>
                    </nav>

                    <main className="col-md-9 ms-sm-auto col-lg-10">
                        {activeSidebar === 'overview' && (
                            <>
                                <div className="container mt-4">
                                    <div className="Inforshop mb-4">
                                        Tổng Quan
                                        <table className="table w-100 table-bordered">
                                            <tbody>
                                                <tr>
                                                    <th>Tên Cửa Hàng</th>
                                                    <td className="align-middle">
                                                        <h1>{shop.name}</h1>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Logo Shop</th>
                                                    <td className="align-middle" style={{ width: '150px' }}>
                                                        <img src={shop.logo} alt={shop.name} className="img-fluid" />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table className="table table-bordered">
                                            <tbody>
                                                <tr>
                                                    <th>Đánh giá</th>
                                                    <td>{shop.rating}</td>
                                                </tr>
                                                <tr>
                                                    <th>Nhận xét</th>
                                                    <td>{shop.evaluate}</td>
                                                </tr>
                                                <tr>
                                                    <th>Đã bán</th>
                                                    <td>{shop.sold}</td>
                                                </tr>
                                                <tr>
                                                    <th>Số người theo dõi</th>
                                                    <td>{shop.follower}</td>
                                                </tr>
                                                <tr>
                                                    <th>Ngày tham gia</th>
                                                    <td>{shop.join}</td>
                                                </tr>
                                                <tr>
                                                    <th>Tổng số sản phẩm</th>
                                                    <td>{shop.Product.length}</td>{' '}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="deal mb-4">
                                        <h2>Khuyến mãi:</h2>
                                        <div className="row">
                                            {shop.Deals.map((deal, index) => (
                                                <div key={index} className="col-md-3 mb-2">
                                                    <div className="card text-center">
                                                        <div className="card-body">{deal}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <Button variant="primary" onClick={handleAddDealShow}>
                                            Thêm khuyến mãi
                                        </Button>
                                    </div>
                                    <div className="Product-shop">
                                        <h2>Sản phẩm:</h2>
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Id</th>
                                                    <th>Tên sản phẩm</th>
                                                    <th>Miêu tả</th>
                                                    <th>Hình ảnh</th>
                                                    <th className="wider-column">Màu sắc</th>
                                                    <th className="wider-column">Giá bán</th>
                                                    <th className="wider-column">Giá giảm</th>
                                                    <th className="wider-column">Tồn Kho</th>
                                                    <th>Chức Năng</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {shop.Product.map((product) => (
                                                    <tr key={product['id-item']}>
                                                        <td>{product['id-item']}</td>
                                                        <td>{product.titleproducts}</td>
                                                        <td>{product.describe}</td>
                                                        <td>
                                                            <img
                                                                src={product['image-products'][0]}
                                                                alt={product.titleproducts}
                                                                className="img-fluid"
                                                                style={{ maxWidth: '150px' }}
                                                            />
                                                        </td>
                                                        <td className="wider-column">
                                                            {product.colors[0] &&
                                                                Object.entries(product.colors[0]).map(
                                                                    ([color, details]) => (
                                                                        <div key={color}>
                                                                            <h5>{color}</h5>
                                                                        </div>
                                                                    ),
                                                                )}
                                                        </td>

                                                        <td className="wider-column">
                                                            {product.colors[0] &&
                                                                Object.entries(product.colors[0]).map(
                                                                    ([color, details]) => (
                                                                        <div key={color}>
                                                                            <p>{details.price.original}</p>
                                                                        </div>
                                                                    ),
                                                                )}
                                                        </td>
                                                        <td className="wider-column">
                                                            {product.colors[0] &&
                                                                Object.entries(product.colors[0]).map(
                                                                    ([color, details]) => (
                                                                        <div key={color}>
                                                                            <p>{details.price.fakeprice}</p>
                                                                        </div>
                                                                    ),
                                                                )}
                                                        </td>
                                                        <td className="">
                                                            {product.colors[0] &&
                                                                Object.entries(product.colors[0]).map(
                                                                    ([color, details]) => (
                                                                        <div key={color}>
                                                                            <p>{details.Quality}</p>
                                                                        </div>
                                                                    ),
                                                                )}
                                                        </td>
                                                        <td>
                                                            <Button
                                                                variant="primary"
                                                                onClick={() => handleEditProductShow(product)}
                                                            >
                                                                Sửa
                                                            </Button>
                                                            <Button
                                                                variant="danger"
                                                                onClick={() => handleDeleteProduct(product)}
                                                            >
                                                                Xóa
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                        {activeSidebar === 'add-product' && (
                            <>
                                <div className="add-product-table">
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <th>Tên sản phẩm</th>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="titleproducts"
                                                        value={newProduct.titleproducts}
                                                        onChange={handleProductChange}
                                                        placeholder="Tên sản phẩm"
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Mô Tả Sản Phẩm</th>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="describe"
                                                        value={newProduct.describe}
                                                        onChange={handleProductChange}
                                                        placeholder="Miêu tả"
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Thể Loại</th>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <th>Thông Số</th>
                                                <td>
                                                    <select
                                                        value={selectedSpecification}
                                                        onChange={handleSpecificationChange}
                                                    >
                                                        <option value="ts1">Màu Sắc</option>
                                                        <option value="ts2">Kích Thước</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            {newProduct.colors.map((color, index) => (
                                                <React.Fragment key={index}>
                                                    <tr>
                                                        <th>Loại Hàng</th>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                name="color"
                                                                value={color.color}
                                                                onChange={(e) => handleColorChange(e, index)}
                                                                placeholder={placeholder}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Giá Nhập</th>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                name="priceOriginal"
                                                                onChange={(e) => handleColorChange(e, index)}
                                                                placeholder="Giá Nhập"
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Giá Bán</th>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                name="priceOriginal"
                                                                value={color.priceOriginal}
                                                                onChange={(e) => handleColorChange(e, index)}
                                                                placeholder="Giá Bán"
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Số Lượng</th>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                name="quantity"
                                                                value={color.quantity}
                                                                onChange={(e) => handleColorChange(e, index)}
                                                                placeholder="Số lượng"
                                                            />
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            ))}
                                            <tr>
                                                <th>Thêm Hình Ảnh</th>
                                                <td>
                                                    <DragAndDropImage />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Button variant="secondary" onClick={handleAddColor}>
                                                        Thêm màu sắc
                                                    </Button>
                                                </td>
                                                <td>
                                                    <Button variant="primary" onClick={handleAddProduct}>
                                                        Thêm sản phẩm
                                                    </Button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {activeSidebar === 'sales' && (
                            <>
                                <div className="Sales">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>id</th>
                                                <th>Tên Sản Phẩm</th>
                                                <th>Loại Hàng</th>
                                                <th>Đã Bán</th>
                                                <th>Trả Hàng</th>
                                                <th>Doanh Thu Của Loại Sản Phẩm</th>
                                                <th>Tổng Doanh Thu Của Sản Phẩm</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {shop.Product.map((product) => {
                                                const totalRevenue = product.colors[0]
                                                    ? Object.entries(product.colors[0]).reduce(
                                                          (acc, [color, details]) => {
                                                              const original = parseFloat(
                                                                  details.price.original.replace(/[\.,]/g, ''),
                                                              );
                                                              const sold = parseInt(details.sold, 10);
                                                              const returns = parseInt(details.return, 10);
                                                              const revenue = original * (sold - returns);
                                                              return acc + revenue;
                                                          },
                                                          0,
                                                      )
                                                    : 0;

                                                return (
                                                    <tr key={product['id-item']}>
                                                        <td>{product['id-item']}</td>
                                                        <td>{product.titleproducts}</td>
                                                        <td>
                                                            {product.colors[0] &&
                                                                Object.entries(product.colors[0]).map(
                                                                    ([color, details]) => (
                                                                        <div key={color}>
                                                                            <h5>{color}</h5>
                                                                        </div>
                                                                    ),
                                                                )}
                                                        </td>
                                                        <td>
                                                            {product.colors[0] &&
                                                                Object.entries(product.colors[0]).map(
                                                                    ([color, details]) => (
                                                                        <div key={color}>
                                                                            <p>{details.sold}</p>
                                                                        </div>
                                                                    ),
                                                                )}
                                                        </td>
                                                        <td>
                                                            {product.colors[0] &&
                                                                Object.entries(product.colors[0]).map(
                                                                    ([color, details]) => (
                                                                        <div key={color}>
                                                                            <p>{details.return}</p>
                                                                        </div>
                                                                    ),
                                                                )}
                                                        </td>
                                                        <td>
                                                            {product.colors[0] &&
                                                                Object.entries(product.colors[0]).map(
                                                                    ([color, details]) => {
                                                                        const originalPrice = parseFloat(
                                                                            details.price.original.replace(
                                                                                /[\.,]/g,
                                                                                '',
                                                                            ), // Thay price.discounted thành price.original
                                                                        );
                                                                        const sold = parseInt(details.sold, 10);
                                                                        const returns = parseInt(details.return, 10);
                                                                        const revenue =
                                                                            originalPrice * (sold - returns); // Tính doanh thu

                                                                        return (
                                                                            <div key={color}>
                                                                                <p>{revenue.toLocaleString()} VNĐ</p>
                                                                            </div>
                                                                        );
                                                                    },
                                                                )}
                                                        </td>

                                                        <td>
                                                            <p>{totalRevenue.toLocaleString()} VNĐ</p>{' '}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>

                                        <tfoot>
                                            <tr>
                                                <th>Tổng Doanh Thu Của Cửa Hàng</th>
                                                <th colSpan="3">{`${totalStoreRevenueInWords}`}</th>
                                                <th colSpan="3">{totalStoreRevenue.toLocaleString()}</th>
                                            </tr>
                                            <tr>
                                                <td colSpan={5}>
                                                    <BarChart products={shop.Product} />
                                                </td>
                                                <td colSpan={2}>
                                                    <PieChart products={shop.Product} />
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </>
                        )}
                        {/* {activeSidebar === 'order' && (
                            <>
                                <div className="Oder">
                                    <table className="Oder-table">
                                        <thead>
                                            <th>Mã Đơn Hàng</th>
                                            <th>Khách Hàng</th>
                                            <th>Tên Sản Phẩm</th>
                                            <th>Loại Hàng</th>
                                            <th>Giá Tiền</th>
                                            <th>Trạng Thái</th>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </>
                        )} */}
                    </main>
                </div>
            </div>

            <Modal show={showAddDealModal} onHide={handleAddDealClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm khuyến mãi</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNewDeal">
                            <Form.Label>Khuyến mãi mới</Form.Label>
                            <Form.Control type="text" value={newDeal} onChange={(e) => setNewDeal(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAddDealClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleAddDeal}>
                        Thêm khuyến mãi
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showEditProductModal}
                onHide={() => setShowEditProductModal(false)}
                dialogClassName="custom-modal-dialog"
                contentClassName="custom-modal-content"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa thông tin sản phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formProductTitle">
                            <Form.Label>Tên sản phẩm</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={productEditData?.title || ''}
                                onChange={(e) => setProductEditData({ ...productEditData, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formProductDescription">
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={productEditData?.description || ''}
                                onChange={(e) =>
                                    setProductEditData({ ...productEditData, description: e.target.value })
                                }
                            />
                        </Form.Group>
                        {productEditData?.colors.map((colorData, index) => (
                            <div key={index} className="row mb-3">
                                <div className="col-md-4">
                                    <h5>{colorData.color}</h5>
                                </div>
                                <div className="col-md-8">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <Form.Group controlId={`formProductPriceFakePrice-${index}`}>
                                                <Form.Label>Giá Gốc</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="pricefakeprice" // Thay đổi tên trường thành pricefakeprice
                                                    value={colorData.pricefakeprice} // Đảm bảo sử dụng biến đúng
                                                    onChange={(e) => handleProductInputChange(e, index)}
                                                />
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-4">
                                            <Form.Group controlId={`formProductPriceOriginal-${index}`}>
                                                <Form.Label>Giá giảm</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="priceOriginal"
                                                    value={colorData.priceOriginal} // Thay đổi ở đây để lấy giá giảm
                                                    onChange={(e) => handleProductInputChange(e, index)}
                                                />
                                            </Form.Group>
                                        </div>

                                        <div className="col-md-4">
                                            <Form.Group controlId={`formProductQuantity-${index}`}>
                                                <Form.Label>Số lượng</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="quantity"
                                                    value={colorData.quantity}
                                                    onChange={(e) => handleProductInputChange(e, index)}
                                                />
                                            </Form.Group>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditProductModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSaveProductChanges}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MasterStore;
