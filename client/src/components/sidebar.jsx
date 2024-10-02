// NavigationMenu.jsx
import React, { useState } from 'react';
import '../style/components/Sidebar.css';

const NavigationMenu = ({ categories }) => {
    const [openCategory, setOpenCategory] = useState(null);

    const toggleCategory = (id) => {
        setOpenCategory(openCategory === id ? null : id);
    };

    return (
        <div className="pt-3 navigation-menu">
            <div className="navigation-menu-header">
                <h3>Danh Mục</h3>
            </div>
            <ul className="navigation-menu-list">
                {categories.map((category) => (
                    <li key={category.id} className="navigation-menu-item">
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                toggleCategory(category.id);
                            }}
                        >
                            {category.name}
                        </a>
                        {category.subcategories && (
                            <ul className={`navigation-menu-submenu ${openCategory === category.id ? 'open' : ''}`}>
                                {category.subcategories.map((sub) => (
                                    <li key={sub.id}>
                                        <a href={sub.link}>{sub.name}</a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NavigationMenu;
