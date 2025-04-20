import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// icons
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// components
import CartModal from "../Cart/CartModal";

// styles
import "./Navbar.css";

const Navbar = ({ title = "Mert's E-commerce" }) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const cartItems = useSelector((state) => state.cart.items);
    const cartTotal = useSelector((state) => state.cart.total);
    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    // Debug log for cart state
    useEffect(() => {
        console.log("Current Cart State:", {
            items: cartItems,
            total: cartTotal,
            count: cartCount,
            itemDetails: cartItems.map((item) => ({
                id: item.pid,
                cartItemId: item.cartItemId,
                name: item.name || item.title,
                price: item.price,
                finalPrice: item.finalPrice,
                quantity: item.quantity,
            })),
        });
    }, [cartItems, cartTotal, cartCount]);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    {title}
                </Link>

                <div className="navbar-links">
                    <Link to="/" className="nav-link">
                        Home
                    </Link>
                    <Link to="/products" className="nav-link">
                        Products
                    </Link>
                </div>

                <div className="navbar-icons">
                    <button
                        className="cart-icon"
                        onClick={() => setIsCartOpen(true)}
                        aria-label="Shopping Cart"
                    >
                        <ShoppingCartIcon />
                        {cartCount > 0 && (
                            <span className="cart-count">{cartCount}</span>
                        )}
                    </button>
                </div>
            </div>

            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
        </nav>
    );
};

export default Navbar;
