import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../../store/cartSlice";
import "./CartModal.css";

const CartModal = ({ isOpen, onClose }) => {
    const cartItems = useSelector((state) => state.cart.items);
    const total = useSelector((state) => state.cart.total);
    const dispatch = useDispatch();

    if (!isOpen) return null;

    const handleRemoveItem = (pid) => {
        dispatch(removeFromCart(pid));
    };

    const handleQuantityChange = (pid, newQuantity) => {
        if (newQuantity > 0) {
            dispatch(updateQuantity({ pid, quantity: newQuantity }));
        }
    };

    return (
        <div className="cart-modal-overlay" onClick={onClose}>
            <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
                <div className="cart-modal-header">
                    <h2>Your Cart</h2>
                    <button className="close-button" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <p className="empty-cart">Your cart is empty</p>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.pid} className="cart-item">
                                <img src={item.image} alt={item.title} />
                                <div className="cart-item-details">
                                    <h3>{item.title}</h3>
                                    <p>${item.price}</p>
                                    <div className="quantity-controls">
                                        <button
                                            onClick={() =>
                                                handleQuantityChange(
                                                    item.pid,
                                                    item.quantity - 1
                                                )
                                            }
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() =>
                                                handleQuantityChange(
                                                    item.pid,
                                                    item.quantity + 1
                                                )
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <button
                                    className="remove-item"
                                    onClick={() => handleRemoveItem(item.pid)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-summary">
                        <div className="cart-total">
                            <h3>Total: ${total.toFixed(2)}</h3>
                        </div>
                        <button className="checkout-button">
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartModal;
