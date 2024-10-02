import React, { useState, useEffect } from 'react';

const CartState = ({ id, o_price, stock, preCount }) => {
    const getInitialCount = () => parseInt(localStorage.getItem(`quantityCount_${id}`)) || preCount;
    const getInitialPrice = () => parseInt(localStorage.getItem(`cartPrice_${id}`)) || o_price * preCount;

    const [count, setCount] = useState(getInitialCount);
    const [price, setPrice] = useState(getInitialPrice);

    useEffect(() => {
        const localCount = parseInt(localStorage.getItem(`quantityCount_${id}`));
        const localPrice = parseInt(localStorage.getItem(`cartPrice_${id}`));

        if (localCount && localCount !== count) {
            setCount(localCount);
        }

        if (localPrice && localPrice !== price) {
            setPrice(localPrice);
        }
    }, [id]); // code này giúp ngăn tình trạng gán giá trị không mong muốn cho local

    const handleIncrement = () => {
        if (count < stock) {
            const newCount = count + 1;
            const newPrice = o_price * newCount;
            setCount(newCount);
            setPrice(newPrice);
            if (localStorage.getItem(`${id}`)) {
                window.location.reload();
            }
        }
    };

    const handleDecrement = () => {
        if (count > 1) {
            const newCount = count - 1;
            const newPrice = o_price * newCount;
            setCount(newCount);
            setPrice(newPrice);
        }
    };

    useEffect(() => {
        localStorage.setItem(`quantityCount_${id}`, count);
        localStorage.setItem(`cartPrice_${id}`, price);
    }, [count, price, id]);

    return (
        <>
            <li className="col text-center quantity">
                <div className="quantity-input d-flex align-items-center">
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleDecrement}
                        aria-label="Decrease quantity"
                    >
                        -
                    </button>
                    <input
                        type="text"
                        value={count}
                        readOnly
                        className="form-control text-center mx-2"
                        style={{ width: '50px' }}
                        aria-label={`Quantity: ${count}`}
                    />
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleIncrement}
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                </div>
                <p className="mt-2 text_color_gray">{stock} sản phẩm có sẵn</p>
            </li>
            <li className="col text-center total_price">{price.toLocaleString('vi-VN')}</li>
        </>
    );
};

export default CartState;
