import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGooglePlusG } from '@fortawesome/free-brands-svg-icons';
import '../style/Pages/auth.css';
import { GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebase-config';
import { useNavigate } from 'react-router-dom';

function Auth() {
    const [isSignUpActive, setIsSignUpActive] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phonenumber: '',
    });
    const navigate = useNavigate();
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Đăng ký thành công:', data);
            } else {
                console.error('Lỗi đăng ký:', data.message);
            }
        } catch (error) {
            console.error('Lỗi trong quá trình đăng ký:', error.message);
        }
    };

    // Hàm đăng nhập
    const handleSignIn = async (e) => {
        e.preventDefault();
        console.log('hello');
        const { email, password } = formData;
        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.metadata.token);
                navigate('/');
            } else {
                console.error('Lỗi đăng nhập:', data.message);
            }
        } catch (error) {
            console.error('Lỗi trong quá trình đăng nhập:', error.message);
        }
    };

    const handleSignUpClick = () => {
        setIsSignUpActive(true);
    };

    const handleSignInClick = () => {
        setIsSignUpActive(false);
    };

    const handleGoogle = async (e) => {
        e.preventDefault();

        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userData = {
                uid: user.uid,
                username: user.displayName,
                email: user.email,
                photourl: user.photoURL,
            };

            const response = await fetch('http://localhost:5000/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.metadata.token);
                navigate('/');
            } else {
                console.error('Server error:', data.message);
            }
        } catch (error) {
            console.error('Error during sign in:', error.message);
        }
    };

    const handleFacebook = async (e) => {
        e.preventDefault();

        const provider = new FacebookAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userData = {
                uid: user.uid,
                username: user.displayName,
                email: user.email,
                photourl: user.photoURL,
            };

            const response = await fetch('http://localhost:5000/auth/facebook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.metadata.token);
                navigate('/');
            } else {
                console.error('Server error:', data.message);
            }
        } catch (error) {
            console.error('Error during sign in:', error.message);
        }
    };

    return (
        <>
            <div className="login-container">
                <div className={`container ${isSignUpActive ? 'right-panel-active' : ''}`} id="container">
                    <div className="form-container sign-up-container">
                        <form onSubmit={handleSignUp}>
                            <h1>Đăng Ký</h1>
                            <div className="social-container">
                                <a href="#" className="social" onClick={handleFacebook}>
                                    <FontAwesomeIcon icon={faFacebookF} />
                                </a>
                                <a href="#" className="social" onClick={handleGoogle}>
                                    <FontAwesomeIcon icon={faGooglePlusG} />
                                </a>
                            </div>
                            <input
                                type="text"
                                name="username"
                                placeholder="Tên Đăng Nhập"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="phonenumber"
                                placeholder="Số điện thoại"
                                value={formData.phonenumber}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Mật Khẩu"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <button>Đăng Ký</button>
                        </form>
                    </div>
                    <div className="form-container sign-in-container">
                        <form onSubmit={handleSignIn}>
                            <h1>Đăng Nhập</h1>
                            <div className="social-container">
                                <a href="#" className="social" onClick={handleFacebook}>
                                    <FontAwesomeIcon icon={faFacebookF} />
                                </a>
                                <a href="#" className="social" onClick={handleGoogle}>
                                    <FontAwesomeIcon icon={faGooglePlusG} />
                                </a>
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Mật Khẩu"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                onClick={async (e) => {
                                    e.preventDefault();
                                    const { email, password } = formData;

                                    try {
                                        const response = await fetch('http://localhost:5000/auth/login', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({ email, password }),
                                        });

                                        const data = await response.json();

                                        if (response.ok) {
                                            localStorage.setItem('token', data.metadata.token);
                                            navigate('/');
                                        } else {
                                            console.error('Lỗi đăng nhập:', data.message);
                                        }
                                    } catch (error) {
                                        console.error('Lỗi trong quá trình đăng nhập:', error.message);
                                    }
                                }}
                            >
                                Đăng Nhập
                            </button>
                        </form>
                    </div>
                    <div className="overlay-container">
                        <div className="overlay">
                            <div className="overlay-panel overlay-left">
                                <h1>Chào Mừng</h1>
                                <p>Đăng nhập để có trải nghiệm tốt nhất</p>
                                <button className="ghost" onClick={handleSignInClick}>
                                    Đăng Nhập
                                </button>
                            </div>
                            <div className="overlay-panel overlay-right">
                                <h1>Chào Mừng</h1>
                                <p>Bắt Đầu Trải Nghiệm Bằng Việc Đăng Ký</p>
                                <button className="ghost" onClick={handleSignUpClick}>
                                    Đăng Ký
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Auth;
