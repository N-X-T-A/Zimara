import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../style/components/Thumnail.css';
import { arrow } from '@popperjs/core';

const ThumbnailSlider = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '0',
        focusOnSelect: true,
        arrows: false,
        afterChange: (index) => setSelectedImage(images[index]),
    };

    return (
        <div className="thumbnail-slider">
            <div className="main-image">
                <img src={selectedImage} alt="Selected" />
            </div>
            <Slider {...settings} className="thumbnail-carousel">
                {images.map((image, index) => (
                    <div key={index} className="thumbnail-slide">
                        <img src={image} alt={`Thumbnail ${index + 1}`} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ThumbnailSlider;
