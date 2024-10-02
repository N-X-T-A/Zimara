// Sidebar.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTachometerAlt,
    faShoppingCart,
    faUsers,
    faEnvelope,
    faBox,
    faPlug,
    faChartLine,
    faFileInvoice,
    faTag,
    faCog,
    faShieldAlt,
    faLifeRing,
} from '@fortawesome/free-solid-svg-icons';

const icons = {
    'tachometer-alt': faTachometerAlt,
    'shopping-cart': faShoppingCart,
    users: faUsers,
    envelope: faEnvelope,
    box: faBox,
    plug: faPlug,
    'chart-line': faChartLine,
    'file-invoice': faFileInvoice,
    tag: faTag,
    cog: faCog,
    'shield-alt': faShieldAlt,
    'life-ring': faLifeRing,
};

const Sidebar = ({ items }) => {
    return (
        <div className="sidebar">
            <ul>
                {items.map((item) => (
                    <li key={item.name}>
                        <a href={item.link}>
                            <FontAwesomeIcon icon={icons[item.icon]} />
                            {item.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
