import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import CartPage from './pages/cart_page';
import PlaceOrderPage from './pages/PlaceOrderPage';
import Home from './pages/Home';
import Test from './pages/Test';
import ProductDetail from './pages/ProductDetail';
import AdminPage from './pages/Admin';
import ShopList from './pages/ShopList';
import MasterStore from './pages/MasterStore';
import User from './pages/User';
import ProductList from './pages/ProductList';
import ShopDetail from './pages/ShopDetail';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import Auth from './pages/login_register';

function App() {
    return (
        <>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/CartPage" element={<CartPage />} />
                        <Route path="/PlaceOrderPage" element={<PlaceOrderPage />} />
                        <Route path="/product/:productId" element={<ProductDetail />} />
                        <Route path="/productlist" element={<ProductList />} />
                        <Route path="/user/:Id" element={<User />} />
                        <Route path="/mastershop/:Id" element={<MasterStore />} />
                        <Route path="/shop/:Id" element={<ShopDetail />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/test" element={<Test />} />
                        <Route path="/auth" element={<Auth />} />
                    </Routes>
                </div>
            </Router>
        </>
    );
}

export default App;
