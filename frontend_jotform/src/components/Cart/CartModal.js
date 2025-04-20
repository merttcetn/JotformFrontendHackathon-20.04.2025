import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../../store/cartSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import "./CartModal.css";

const CartModal = ({ isOpen, onClose }) => {
    const cartItems = useSelector((state) => state.cart.items);
    const total = useSelector((state) => state.cart.total);
    const dispatch = useDispatch();

    // For debugging
    React.useEffect(() => {
        if (cartItems.length > 0) {
            console.log("Full cart item data:", cartItems[0]);
        }
    }, [cartItems]);

    if (!isOpen) return null;

    const handleRemoveItem = (pid) => {
        dispatch(removeFromCart(pid));
    };

    const handleQuantityChange = (pid, newQuantity) => {
        if (newQuantity > 0) {
            dispatch(updateQuantity({ pid, quantity: newQuantity }));
        }
    };

    // Get the product title or name depending on what's available
    const getProductTitle = (item) => {
        return item.name || item.title || "Product";
    };

    // Get the product category information
    const getProductCategory = (item) => {
        if (item.category) return item.category;
        if (item.cid) return `Category ID: ${item.cid}`;
        return "";
    };

    return (
        <div className="cart-modal-overlay" onClick={onClose}>
            <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
                <div className="cart-modal-header">
                    <h2>Your Cart</h2>
                    <button className="close-button" onClick={onClose}>
                        <CloseIcon />
                    </button>
                </div>

                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <p className="empty-cart">Your cart is empty</p>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.pid} className="cart-item">
                                <img
                                    src={item.image}
                                    alt={getProductTitle(item)}
                                />
                                <div className="cart-item-details">
                                    <h3>{getProductTitle(item)}</h3>
                                    <p className="item-category">
                                        {getProductCategory(item)}
                                    </p>
                                    <p className="item-id">
                                        Product ID: {item.pid}
                                    </p>
                                    {item.description && (
                                        <p className="item-description">
                                            {item.description.length > 100
                                                ? `${item.description.substring(
                                                      0,
                                                      100
                                                  )}...`
                                                : item.description}
                                        </p>
                                    )}
                                    <p className="item-price">${item.price}</p>
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
                                    <p className="item-subtotal">
                                        Subtotal: $
                                        {(
                                            parseFloat(item.price) *
                                            item.quantity
                                        ).toFixed(2)}
                                    </p>
                                </div>
                                <button
                                    className="remove-item"
                                    onClick={() => handleRemoveItem(item.pid)}
                                    title="Remove item"
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-summary">
                        <div className="cart-total">
                            <div className="total-details">
                                <p>
                                    Items in cart:{" "}
                                    {cartItems.reduce(
                                        (sum, item) => sum + item.quantity,
                                        0
                                    )}
                                </p>
                                <h3>Total: ${total.toFixed(2)}</h3>
                            </div>
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
