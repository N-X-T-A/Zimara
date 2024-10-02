import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHeart, faCartShopping, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import '../style//components/Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
    const token = localStorage.getItem('token');

    const logOut = () => {
        localStorage.removeItem('token');
    };
    return (
        <>
            <header>
                <div className="header-content-top">
                    <div className="content">
                        <span>
                            <FontAwesomeIcon icon={faPhone} /> 1900 6079
                        </span>
                        <span>
                            <FontAwesomeIcon icon={faEnvelope} />
                            Zimara@email.com
                        </span>
                    </div>
                </div>

                <div className="header-content-mid-bottom py-3">
                    <div className="container">
                        <div className="row container-header">
                            <div className="col-2">
                                <strong className="logo">
                                    <a href="/">
                                        <img style={{ width: '130px' }} src="/images/Zimara.png" alt="" />
                                    </a>
                                </strong>
                            </div>

                            <div className="col-7">
                                <label className="open-search" htmlFor="open-search">
                                    <i className="fas fa-search" />
                                    <input className="input-open-search" id="open-search" type="checkbox" name="menu" />
                                    <div className="search">
                                        <button className="button-search d-flex align-items-center justify-content-center">
                                            <FontAwesomeIcon icon={faSearch} />
                                        </button>
                                        <input type="text" placeholder="Tìm Kiếm" className="input-search" />
                                    </div>
                                </label>
                            </div>
                            {/* // search */}
                            <div className="col-3">
                                <nav className="nav-content">
                                    {/* nav */}
                                    <ul className="nav-content-list">
                                        <li className="nav-content-item">
                                            <a className="nav-content-link" href="">
                                                <FontAwesomeIcon icon={faHeart} />
                                            </a>
                                        </li>
                                        <li className="nav-content-item">
                                            <a className="nav-content-link" href="/CartPage">
                                                <FontAwesomeIcon icon={faCartShopping} />
                                            </a>
                                        </li>
                                        <li className="nav-content-item account-login">
                                            <label
                                                className="open-menu-login-account"
                                                htmlFor="open-menu-login-account"
                                            >
                                                <input
                                                    className="input-menu"
                                                    id="open-menu-login-account"
                                                    type="checkbox"
                                                    name="menu"
                                                />
                                                <i className="fas fa-user-circle" />
                                                {!token ? (
                                                    <span className="login-text">
                                                        <Link to="/auth">
                                                            {' '}
                                                            <div className="fw-bold fs-5">Đăng nhập</div>
                                                        </Link>
                                                    </span>
                                                ) : (
                                                    <>
                                                        <span className="login-text">
                                                            <img
                                                                style={{
                                                                    width: '40px',
                                                                    height: '40px',
                                                                    borderRadius: '100px',
                                                                }}
                                                                src="https://cdn.tuoitre.vn/zoom/700_525/2019/5/8/avatar-publicitystill-h2019-1557284559744252594756-crop-15572850428231644565436.jpg"
                                                            />
                                                        </span>
                                                        <ul className="login-list">
                                                            <li className="login-list-item">
                                                                <a href="">Thông Tin</a>
                                                            </li>
                                                            <li className="login-list-item">
                                                                <a href="/mastershop/11">Đăng Nhập Bán Hàng</a>
                                                            </li>
                                                            <li className="login-list-item">
                                                                <a href="" onClick={logOut}>
                                                                    Đăng Xuất
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </>
                                                )}
                                            </label>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                    {/* nav navigation commerce */}
                </div>
            </header>
        </>
    );
};

export default Header;
