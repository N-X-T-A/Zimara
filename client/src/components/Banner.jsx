import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../style/components/Banner.css'; // Import file CSS

const Banner = () => {
    const settingsBanner = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
    };

    return (
        <div className="container py-3 banner-container">
            <div className="row">
                <div className="col-8 p-0 pe-1 slider-wrapper">
                    <Slider {...settingsBanner}>
                        <div>
                            <img src="/images/image 7.png" alt="Banner 1" className="main-banner" />
                        </div>
                        <div>
                            <img src="/images/image 7.png" alt="Banner 2" className="main-banner" />
                        </div>
                        <div>
                            <img src="/images/image 7.png" alt="Banner 3" className="main-banner" />
                        </div>
                    </Slider>
                </div>
                <div className="col-4 ps-0 side-banners">
                    <div className="row flex-column">
                        <div className="col mb-1">
                            <img src="/images/image 7.png" alt="Banner 1" className="sub-banner" />
                        </div>
                        <div className="col">
                            <img src="/images/image 7.png" alt="Banner 1" className="sub-banner" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;
