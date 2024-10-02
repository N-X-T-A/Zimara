import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../style/components/category.css';

const CategoriesComponent = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/category/');
                setCategories(response.data.metadata);
                setLoading(false);
                console.log(response.data.metadata[2].name);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // if (loading) return <div>Loading...</div>;
    // if (error) return <div>Error: {error.message}</div>;

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 10,
        slidesToScroll: 10,
        rows: 2,
    };

    return (
        <div className="slider-card-category">
            <div className="container">
                <div className="row">
                    <Slider {...settings}>
                        {categories.map((category, index) => (
                            <div key={category.id} className="category-card">
                                <a href="/productlist">
                                    <img src={category.image} alt={category.name} />
                                </a>
                                <h2>{category.name}</h2>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default CategoriesComponent;
