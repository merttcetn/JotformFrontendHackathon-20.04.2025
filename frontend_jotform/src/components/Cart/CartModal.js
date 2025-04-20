import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromCart, updateQuantity } from "../../store/cartSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import "./CartModal.css";

const CartModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
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

    const handleRemoveItem = (cartItemId) => {
        dispatch(removeFromCart(cartItemId));
    };

    const handleQuantityChange = (cartItemId, newQuantity) => {
        if (newQuantity > 0) {
            dispatch(updateQuantity({ cartItemId, quantity: newQuantity }));
        }
    };

    const handleCheckout = () => {
        onClose(); // Close the modal
        navigate("/checkout"); // Navigate to checkout page
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

    // Get the product price
    const getProductPrice = (item) => {
        return item.finalPrice || item.price;
    };

    // Format the connected information
    const formatConnectedInfo = (connectedData, type) => {
        if (!connectedData) return "None";

        let parsed = connectedData;
        if (typeof connectedData === "string") {
            try {
                parsed = JSON.parse(connectedData);
            } catch (e) {
                return connectedData;
            }
        }

        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.join(", ");
        }

        return "None";
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
                            <div
                                key={item.cartItemId || item.pid}
                                className="cart-item"
                            >
                                <img
                                    src={item.image}
                                    alt={getProductTitle(item)}
                                />
                                <div className="cart-item-details">
                                    <h3>{getProductTitle(item)}</h3>
                                    {item.selectedOption && (
                                        <p className="item-option">
                                            Option: {item.selectedOption}
                                        </p>
                                    )}
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

                                    <div className="item-additional-info">
                                        <div className="info-tooltip">
                                            <InfoIcon fontSize="small" />
                                            <div className="tooltip-content">
                                                <ul>
                                                    {item.paymentUUID && (
                                                        <li>
                                                            Payment UUID:{" "}
                                                            {item.paymentUUID}
                                                        </li>
                                                    )}
                                                    {item.connectedCategories && (
                                                        <li>
                                                            Connected
                                                            Categories:{" "}
                                                            {formatConnectedInfo(
                                                                item.connectedCategories
                                                            )}
                                                        </li>
                                                    )}
                                                    {item.connectedProducts && (
                                                        <li>
                                                            Connected Products:{" "}
                                                            {formatConnectedInfo(
                                                                item.connectedProducts
                                                            )}
                                                        </li>
                                                    )}
                                                    {item.fitImageToCanvas && (
                                                        <li>
                                                            Fit Image:{" "}
                                                            {
                                                                item.fitImageToCanvas
                                                            }
                                                        </li>
                                                    )}
                                                    {item.isStockControlEnabled && (
                                                        <li>
                                                            Stock Control:{" "}
                                                            {
                                                                item.isStockControlEnabled
                                                            }
                                                        </li>
                                                    )}
                                                    {item.corder && (
                                                        <li>
                                                            Order: {item.corder}
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="item-price">
                                        ${getProductPrice(item)}
                                    </p>
                                    <div className="quantity-controls">
                                        <button
                                            onClick={() =>
                                                handleQuantityChange(
                                                    item.cartItemId || item.pid,
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
                                                    item.cartItemId || item.pid,
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
                                            parseFloat(getProductPrice(item)) *
                                            item.quantity
                                        ).toFixed(2)}
                                    </p>
                                </div>
                                <button
                                    className="remove-item"
                                    onClick={() =>
                                        handleRemoveItem(
                                            item.cartItemId || item.pid
                                        )
                                    }
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
                        <button
                            className="checkout-button"
                            onClick={handleCheckout}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartModal;
