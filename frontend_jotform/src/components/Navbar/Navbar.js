import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// icons
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// components
import CartModal from "../Cart/CartModal";

// styles
import "./Navbar.css";

const Navbar = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const cartItems = useSelector((state) => state.cart.items);
    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Mert's E-commerce
                </Link>

                <div className="navbar-links">
                    <Link to="/" className="nav-link">
                        Home & Products
                    </Link>
                    <Link to="/about" className="nav-link">
                        About
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
