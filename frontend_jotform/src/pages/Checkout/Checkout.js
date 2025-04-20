import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../store/cartSlice";
import "./Checkout.css";

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const total = useSelector((state) => state.cart.total);

    const handleGoBack = () => {
        navigate("/");
    };

    const handleSubmitOrder = () => {
        dispatch(clearCart());
        alert("Thank you for your order! Order has been placed successfully.");
        navigate("/");
    };

    // Get the product price
    const getProductPrice = (item) => {
        return item.finalPrice || item.price;
    };

    if (cartItems.length === 0) {
        return (
            <div className="checkout-container">
                <div className="checkout-empty">
                    <h2>Your cart is empty</h2>
                    <p>
                        Please add some items to your cart before checking out.
                    </p>
                    <button className="return-button" onClick={handleGoBack}>
                        Return to Shop
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <h1 className="checkout-title">Order Summary</h1>

            <div className="checkout-layout">
                <div className="checkout-order-summary">
                    <h2>Your Cart Items</h2>
                    <div className="checkout-items">
                        {cartItems.map((item) => (
                            <div
                                key={item.cartItemId || item.pid}
                                className="checkout-item"
                            >
                                <div className="checkout-item-image">
                                    <img
                                        src={item.image}
                                        alt={item.name || item.title}
                                    />
                                </div>
                                <div className="checkout-item-details">
                                    <h3>{item.name || item.title}</h3>
                                    {item.selectedOption && (
                                        <p className="checkout-item-option">
                                            Option: {item.selectedOption}
                                        </p>
                                    )}
                                    <p className="checkout-item-price">
                                        ${getProductPrice(item)} ×{" "}
                                        {item.quantity}
                                    </p>
                                    <p className="checkout-item-subtotal">
                                        $
                                        {(
                                            parseFloat(getProductPrice(item)) *
                                            item.quantity
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="checkout-totals">
                        <div className="checkout-subtotal">
                            <span>Subtotal:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="checkout-shipping">
                            <span>Shipping:</span>
                            <span>Free</span>
                        </div>
                        <div className="checkout-tax">
                            <span>Tax:</span>
                            <span>${(total * 0.08).toFixed(2)}</span>
                        </div>
                        <div className="checkout-total">
                            <span>Total:</span>
                            <span>${(total + total * 0.08).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="checkout-actions">
                        <button className="back-button" onClick={handleGoBack}>
                            Back to Shop
                        </button>
                        <button
                            className="place-order-button"
                            onClick={handleSubmitOrder}
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
