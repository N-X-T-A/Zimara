import React from 'react';
import '../style/components/footer.css';
import '@fortawesome/fontawesome-svg-core'

const Footer = () => {
    return (
            <footer className="text-center text-lg-start text-white" style={{ backgroundColor: '#000d2a' }}>
                <section className="d-flex justify-content-between p-4" style={{ backgroundColor: '#0033a0' }}>                   
                    <div className='container'>
                        <a href="" className="text-white me-4">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="" className="text-white me-4">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="" className="text-white me-4">
                            <i className="fab fa-google"></i>
                        </a>
                        <a href="" className="text-white me-4">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="" className="text-white me-4">
                            <i className="fab fa-linkedin"></i>
                        </a>
                        <a href="" className="text-white me-4">
                            <i className="fab fa-github"></i>
                        </a>
                    </div>
                </section>
                <section className="">
                    <div className="container text-center text-md-start mt-5">
                        <div className="row mt-3">
                            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                                <h6 className="text-uppercase fw-bold">Zimara Corp.</h6>
                                <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
                                <p>
                                    Zimara - ứng dụng mua sắm trực tuyến, tin cậy, an toàn! Với sự đảm bảo của Zimara, bạn sẽ mua hàng trực tuyến an tâm và nhanh chóng hơn bao giờ hết!
                                </p>
                            </div>
                            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                                <h6 className="text-uppercase fw-bold">Theo dõi chúng tôi<input type="button" value="" /></h6>
                                <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
                                <p><a href="#!" className="text-white">Facebook</a></p>
                                <p><a href="#!" className="text-white">Youtube</a></p>
                                <p><a href="#!" className="text-white">LinkedIn</a></p>
                                <p><a href="#!" className="text-white">Instagram</a></p>
                            </div>
                            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                                <h6 className="text-uppercase fw-bold">Đơn vị vận chuyển</h6>
                                <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
                                <p><a href="#!" className="text-white">Zimara Xpress</a></p>
                                <p><a href="#!" className="text-white">Giao hàng tiết kiệm</a></p>
                                <p><a href="#!" className="text-white">Giao hàng nhanh</a></p>
                                <p><a href="#!" className="text-white">Viettel Post</a></p>
                            </div>

                            

                            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                                <h6 className="text-uppercase fw-bold">Liên kết thanh toán</h6>
                                <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
                                <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'8px'}}>
                                    <img style={{width:'70%', height:'40px'}} src='data:image/png;base64,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'/>
                                    <img style={{width:'70%', height:'40px'}} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSca3cRkN1wOZVDaGe8RCqaf7A0eujV_68v049sBtZilqprZe5GAhWfoZ4m4lguLPHqpM0&usqp=CAU'/>
                                    <img style={{width:'70%', height:'40px'}} src='https://upload.wikimedia.org/wikipedia/commons/7/72/MasterCard_early_1990s_logo.png'/>
                                    <img style={{width:'70%', height:'40px'}} src='https://static.vecteezy.com/system/resources/previews/030/740/487/original/cash-on-delivery-logo-free-png.png'/>
                                    
                                    
                                    <img style={{width:'70%', height:'40px'}} src='https://cdn.phukiengiare.com/images/seo/seo1/apple-pay-la-gi-01.jpg?1685070602382'/>
                                    <img style={{width:'70%', height:'40px'}} src='https://static.ybox.vn/2021/9/4/1631756121713-1631085786958-Thi%E1%BA%BFt%20k%E1%BA%BF%20kh%C3%B4ng%20t%C3%AAn%20-%202021-09-08T002253.248.png'/>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                    © 2024 Copyright:
                    <a className="text-white" href="https://mdbootstrap.com/"> Zimara.vn</a>
                </div>
            </footer>
    );
};

export default Footer;
