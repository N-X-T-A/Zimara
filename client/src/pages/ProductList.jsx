import React, { useEffect, useState } from 'react';
import '../style/Pages/productlist.css';
import Header from '../components/Header';
import axios from 'axios';
import CategorySidebar from '../components/SidebarCategory';
import PriceSlider from '../components/PriceSlider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

const ProductList = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [maxPrice, setMaxPrice] = useState(100000000);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showPriceSlider, setShowPriceSlider] = useState(false);
    const [showBrandFilter, setShowBrandFilter] = useState(false);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        const fetchShopsData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get('http://localhost:3000/Shops');
                const data = response.data;

                if (!Array.isArray(data)) {
                    throw new Error('Định dạng dữ liệu không hợp lệ: Dữ liệu không phải là mảng');
                }

                setShops(data);

                const uniqueBrands = [...new Set(data.flatMap((shop) => shop.Product.map((product) => product.brand)))];
                setBrands(uniqueBrands);
            } catch (error) {
                setError(error.message || 'Lỗi khi lấy dữ liệu cửa hàng.');
            } finally {
                setLoading(false);
            }
        };

        fetchShopsData();
    }, []);

    const filterProductsByPriceAndBrand = () => {
        const newFilteredProducts = shops.reduce((acc, shop) => {
            const filteredShopProducts = shop.Product.filter((product) => {
                const productUnderMaxPrice =
                    product.colors[0] &&
                    Object.entries(product.colors[0]).some(([color, details]) => {
                        const originalPrice = Number(details.price.original.replace(/\./g, '').trim());
                        return originalPrice <= maxPrice;
                    });

                const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
                const subCategoryMatch = !selectedSubCategory || product.subCategory === selectedSubCategory;

                return productUnderMaxPrice && brandMatch && subCategoryMatch;
            });

            return acc.concat(filteredShopProducts); // Kết hợp các sản phẩm đã lọc
        }, []);

        // Xóa trùng lặp dựa trên ID sản phẩm
        const uniqueProducts = Array.from(new Set(newFilteredProducts.map((product) => product['id-item']))).map((id) =>
            newFilteredProducts.find((product) => product['id-item'] === id),
        );

        // Trộn sản phẩm
        const shuffledProducts = uniqueProducts.sort(() => Math.random() - 0.5);
        setFilteredProducts(shuffledProducts);
    };

    useEffect(() => {
        filterProductsByPriceAndBrand();
    }, [maxPrice, selectedBrands, shops, selectedSubCategory]);

    const handleBrandChange = (brand) => {
        setSelectedBrands((prev) => {
            if (prev.includes(brand)) {
                return prev.filter((b) => b !== brand);
            } else {
                return [...prev, brand];
            }
        });
    };

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>{error}</p>;
    if (!shops.length) return <p>Không có dữ liệu cửa hàng</p>;

    return (
        <div>
            <Header />
            <div className="container">
                <div className="row">
                    <div className="col-2">
                        <div className="row filter-category">
                            <div className="col-12">
                                <CategorySidebar
                                    onSubCategorySelect={setSelectedSubCategory}
                                    selectedSubCategory={selectedSubCategory}
                                />
                            </div>
                            <div className="col-12">
                                <button
                                    onClick={() => setShowPriceSlider(!showPriceSlider)}
                                    className="toggle-price-slider"
                                >
                                    <h3>Bộ lọc giá</h3>
                                </button>
                                {showPriceSlider && (
                                    <PriceSlider
                                        maxPrice={maxPrice}
                                        setMaxPrice={setMaxPrice}
                                        filterProducts={filterProductsByPriceAndBrand}
                                    />
                                )}
                            </div>
                            <div className="col-12">
                                <button
                                    onClick={() => setShowBrandFilter(!showBrandFilter)}
                                    className="toggle-brand-filter"
                                >
                                    <h3>Thương Hiệu</h3>
                                </button>
                                {showBrandFilter && (
                                    <div className="brand-filter">
                                        {brands.map((brand) => (
                                            <div className="item-brand-filter" key={brand}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedBrands.includes(brand)}
                                                        onChange={() => handleBrandChange(brand)}
                                                        className="input"
                                                    />
                                                    <span className="custom-checkbox"></span>
                                                    <div className="text">{brand}</div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-10 product-item-content">
                        <div className="row gy-3">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <div key={product['id-item']} className="col-3">
                                        <div className="product-item">
                                            <div className="wsk-cp-product">
                                                <div className="wsk-cp-img">
                                                    <img
                                                        src={product['image-products'][0]}
                                                        alt={product.titleproducts}
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
                                                                            <span>
                                                                                {firstDetails.price.fakeprice} VNĐ
                                                                            </span>
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
                                ))
                            ) : (
                                <p>Không có sản phẩm nào thỏa mãn điều kiện lọc.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
