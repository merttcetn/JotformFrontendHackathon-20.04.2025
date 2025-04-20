import React from "react";
import { useSelector } from "react-redux";
import "./Cart.css";

const Cart = () => {
    const cartItems = useSelector((state) => state.cart.items);

    const calculateTotal = () => {
        return cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    return (
        <div className="cart-container">
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img src={item.image} alt={item.title} />
                                <div className="cart-item-details">
                                    <h3>{item.title}</h3>
                                    <p>
                                        ${item.price} x {item.quantity}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-total">
                        <h3>Total: ${calculateTotal().toFixed(2)}</h3>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
