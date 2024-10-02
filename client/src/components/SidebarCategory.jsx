import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import '../style/components/Sidebar.css';

const CategorySidebar = ({ onSubCategorySelect, selectedSubCategory, onShowAllProducts }) => {
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [showCategories, setShowCategories] = useState(false);

    useEffect(() => {
        axios
            .get('http://localhost:3000/Shops')
            .then((response) => {
                const products = response.data.flatMap((shop) => shop.Product);
                const categoryMap = {};

                products.forEach((product) => {
                    const { parentCategory, subCategory } = product;
                    if (!categoryMap[parentCategory]) {
                        categoryMap[parentCategory] = [];
                    }
                    if (!categoryMap[parentCategory].includes(subCategory)) {
                        categoryMap[parentCategory].push(subCategory);
                    }
                });

                const categoryArray = Object.entries(categoryMap).map(([parent, subs]) => ({
                    parentCategory: parent,
                    subCategories: subs,
                }));

                setCategories(categoryArray);
            })
            .catch((error) => {
                console.error('Error fetching categories', error);
            });
    }, []);

    const toggleSubCategories = (index) => {
        setActiveCategory(activeCategory === index ? null : index);
    };

    const toggleCategoryList = () => {
        setShowCategories(!showCategories);
    };

    const handleCheckboxChange = (subCategory) => {
        if (selectedSubCategory === subCategory) {
            onSubCategorySelect(null);
        } else {
            onSubCategorySelect(subCategory);
        }
    };

    return (
        <div className="category-sidebar">
            <h3 className="row mb-2 category-title" onClick={toggleCategoryList}>
                <div className="col-10">Danh mục</div>
            </h3>
            {showCategories && (
                <div className="category-list">
                    {categories.map((category, index) => (
                        <div key={category.parentCategory} className="category-item">
                            <button className="category-button" onClick={() => toggleSubCategories(index)}>
                                {category.parentCategory}
                            </button>
                            {activeCategory === index && (
                                <div className="sub-category-list">
                                    {category.subCategories.map((sub) => (
                                        <div key={sub} className="sub-category-item">
                                            <input
                                                className="mx-2"
                                                type="checkbox"
                                                id={sub}
                                                checked={selectedSubCategory === sub} // Đảm bảo trạng thái checkbox đúng
                                                onChange={() => handleCheckboxChange(sub)}
                                            />
                                            <label htmlFor={sub}>{sub}</label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategorySidebar;
