import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import ProductDescriptionEditor from './ProductDescriptionEditor';
import DragAndDropImage from './DragAndDropImage'; // Giả sử bạn có component này
import { Button } from 'react-bootstrap'; // Nếu sử dụng react-bootstrap

const AddProduct = () => {
    const [newProduct, setNewProduct] = useState({
        titleproducts: '',
        categories: [],
        sizeInfo: [],
    });

    const [sizeInput, setSizeInput] = useState('');
    const [priceInput, setPriceInput] = useState('');
    const [sellingPriceInput, setSellingPriceInput] = useState('');
    const [qualityInput, setQualityInput] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showSizeBox, setShowSizeBox] = useState(false);
    const [showListItem, setshowListItem] = useState(false);
    const [formattedDescription, setFormattedDescription] = useState();
    const handleAddSizeInfo = () => {
        const newSizeInfo = {
            sizes: [],
            price: parseFloat(priceInput),
            name: sizeInput,
            quality: qualityInput,
        };

        setNewProduct((prev) => ({
            ...prev,
            sizeInfo: [...prev.sizeInfo, newSizeInfo],
        }));

        // Reset input fields
        setSizeInput('');
        setPriceInput('');
        setSellingPriceInput('');
        setQualityInput('');
        setShowSizeBox(true);
        setshowListItem(true);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/category/');
                if (response.data.statusCode === 200) {
                    setCategories(response.data.metadata);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const totalQuality = useMemo(() => {
        return newProduct.sizeInfo.reduce((total, info) => total + Number(info.quality), 0);
    }, [newProduct.sizeInfo]);

    const editorRef = useRef();

    const formatDescription = (html) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        const paragraphs = Array.from(tempDiv.querySelectorAll('p'));

        const formattedText = paragraphs
            .map((p) => {
                const text = p.innerHTML
                    .replace(/<strong>(.*?)<\/strong>/g, '<b>$1</b>') // Convert <strong> to <b>
                    .replace(/<em>(.*?)<\/em>/g, '<i>$1</i>') // Convert <em> to <i>
                    .replace(/<br\s*\/?>/g, '<br/>') // Normalize <br> and <br/>
                    .replace(/(<br\/>\s*){2,}/g, '<br/>') // Consolidate multiple <br/> into one
                    .replace(/\n/g, '<br/>'); // Replace line breaks

                return text;
            })
            .join('<br/>');

        return formattedText;
    };

    const handleSubmit = () => {
        const rawDescription = editorRef.current.getDescription();
        setFormattedDescription(formatDescription(rawDescription));
    };

    return (
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
                                onChange={(e) => setNewProduct({ ...newProduct, titleproducts: e.target.value })}
                                placeholder="Tên sản phẩm"
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>Mô Tả Sản Phẩm</th>
                        <td>
                            <ProductDescriptionEditor ref={editorRef} />
                        </td>
                    </tr>
                    <tr>
                        <th>Thể Loại</th>
                        <td>
                            <select value={selectedCategory} onChange={handleCategoryChange}>
                                <option value="">Chọn thể loại</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </td>
                    </tr>

                    <tr>
                        <th>
                            {!showListItem && (
                                <>
                                    {' '}
                                    {!showSizeBox ? (
                                        <button onClick={() => setShowSizeBox(true)}>+ Thêm phân loại</button>
                                    ) : (
                                        <button onClick={() => setShowSizeBox(false)}>- Bỏ thêm phân loại</button>
                                    )}
                                </>
                            )}
                        </th>

                        <td>
                            {showSizeBox && (
                                <div className="size-box">
                                    <input
                                        type="text"
                                        placeholder="Loại"
                                        value={sizeInput}
                                        onChange={(e) => setSizeInput(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Giá Nhập"
                                        value={priceInput}
                                        onChange={(e) => setPriceInput(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Giá Bán"
                                        value={sellingPriceInput}
                                        onChange={(e) => setSellingPriceInput(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Số lượng"
                                        value={qualityInput}
                                        onChange={(e) => setQualityInput(e.target.value)}
                                    />
                                    <button onClick={handleAddSizeInfo}>Thêm</button>
                                </div>
                            )}
                        </td>
                    </tr>
                    {!showSizeBox && (
                        <>
                            <tr>
                                <th>Giá Nhập</th>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="Giá Nhập"
                                        value={priceInput}
                                        onChange={(e) => setPriceInput(e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>Giá Bán</th>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="Giá Bán"
                                        value={sellingPriceInput}
                                        onChange={(e) => setSellingPriceInput(e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>Số lượng</th>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="Số lượng"
                                        value={qualityInput}
                                        onChange={(e) => setQualityInput(e.target.value)}
                                    />
                                </td>
                            </tr>
                        </>
                    )}

                    {showListItem && (
                        <>
                            <tr>
                                <th>Phân loại</th>
                                <td>
                                    {newProduct.sizeInfo.map((info, index) => (
                                        <div key={index}>
                                            <p>
                                                {index}: Loại: {info.name}, Giá: {info.price}, Số lượng: {info.quality}
                                            </p>
                                        </div>
                                    ))}
                                </td>
                            </tr>
                            <tr>
                                <th>Số lượng</th>
                                <td>{totalQuality}</td>
                            </tr>
                        </>
                    )}

                    <tr>
                        <th>Thêm Hình Ảnh</th>
                        <td>
                            <DragAndDropImage />
                        </td>
                    </tr>
                    <tr>
                        <th></th>
                        <td>
                            <Button variant="primary" onClick={handleSubmit}>
                                Thêm sản phẩm
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AddProduct;
