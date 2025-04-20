import React, { useState, useEffect } from "react";
import "./App.css";
import { fetchPaymentInfo } from "./services/api";
import Product from "./components/Product";

function App() {
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const FORM_ID = "3";

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchPaymentInfo(FORM_ID);
                setPaymentInfo(data);
            } catch (err) {
                setError("Failed to fetch payment information");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="App">
            <nav className="navbar">
                <div className="logo">ShopEase</div>
                <div className="nav-links">
                    <a href="#home">Home</a>
                    <a href="#products">Products</a>
                    <a href="#about">About</a>
                    <a href="#contact">Contact</a>
                </div>
                <div className="cart-icon">🛒</div>
            </nav>

            <section className="hero">
                <div className="hero-content">
                    <h1>Experience the Best Shopping</h1>
                    <p>Discover amazing products at unbeatable prices</p>
                    <button className="cta-button">Shop Now</button>
                </div>
            </section>

            <section className="payment-section">
                <h2>Payment Information</h2>
                {loading && (
                    <div className="loading-message">
                        Loading payment information...
                    </div>
                )}
                {error && <div className="error-message">{error}</div>}
                {paymentInfo &&
                paymentInfo.products &&
                paymentInfo.products.length > 0 ? (
                    <div className="products-grid">
                        {paymentInfo.products.map((product) => (
                            <Product key={product.pid} product={product} />
                        ))}
                    </div>
                ) : (
                    !loading &&
                    !error && (
                        <div className="no-products">No products available</div>
                    )
                )}
            </section>

            {/* <section className="featured-products">
                <h2>Featured Products</h2>
                <div className="product-grid">
                    <div className="product-card">
                        <img
                            src="https://via.placeholder.com/200"
                            alt="Product 1"
                        />
                        <h3>Product 1</h3>
                        <p>$99.99</p>
                        <button>Add to Cart</button>
                    </div>
                    <div className="product-card">
                        <img
                            src="https://via.placeholder.com/200"
                            alt="Product 2"
                        />
                        <h3>Product 2</h3>
                        <p>$149.99</p>
                        <button>Add to Cart</button>
                    </div>
                    <div className="product-card">
                        <img
                            src="https://via.placeholder.com/200"
                            alt="Product 3"
                        />
                        <h3>Product 3</h3>
                        <p>$199.99</p>
                        <button>Add to Cart</button>
                    </div>
                </div>
            </section> */}

            <footer className="footer">
                <p>&copy; 2025 Mert's E-commerce. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default App;
