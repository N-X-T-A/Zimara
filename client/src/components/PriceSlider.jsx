import React, { useEffect, useState } from 'react';

const PriceSlider = ({ maxPrice, setMaxPrice, filterProducts }) => {
    return (
        <div className="row filter-sildeprice">
            <div className="col-12 line">
                <input
                    type="range"
                    id="priceRange"
                    min="0"
                    max="100000000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
            </div>
            <div className="col-12">
                <label htmlFor="priceRange">{maxPrice.toLocaleString()} VNĐ</label>
            </div>
            <div className="col-12">
                <button className="button" onClick={filterProducts}>
                    Lọc sản phẩm
                </button>
            </div>
        </div>
    );
};

export default PriceSlider;
