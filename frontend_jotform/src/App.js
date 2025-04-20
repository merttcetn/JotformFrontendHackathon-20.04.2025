import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import { fetchPaymentInfo } from "./services/api";
import Product from "./components/Product/Product";

function App() {
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // infinite scroll
    const observer = useRef();
    const loadingRef = useRef();

    // form id for jotform apis
    const FORM_ID_1 = "251073674521959";
    const FORM_ID_2 = "251074257490962";
    const FORM_ID_3 = "251074104261949";

    // prevent body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        // Cleanup function
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isModalOpen]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchPaymentInfo(FORM_ID_3);
                console.log("API Response:", data); // Debug log
                if (data && data.content) {
                    setPaymentInfo(data.content);
                    // İlk 10 ürünü göster
                    setDisplayedProducts(data.content.products.slice(0, 10));
                } else {
                    setError("Invalid response format");
                }
            } catch (err) {
                console.error("Error fetching data:", err); // Debug log
                setError("Failed to fetch payment information");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Infinite scroll için intersection observer
    const lastProductElementRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setCurrentPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    // Sayfa değiştiğinde daha fazla ürün yükle
    useEffect(() => {
        if (currentPage > 1 && paymentInfo && paymentInfo.products) {
            const startIndex = (currentPage - 1) * 10;
            const endIndex = startIndex + 10;
            const newProducts = paymentInfo.products.slice(
                startIndex,
                endIndex
            );

            if (newProducts.length === 0) {
                setHasMore(false);
                return;
            }

            setDisplayedProducts((prevProducts) => [
                ...prevProducts,
                ...newProducts,
            ]);
        }
    }, [currentPage, paymentInfo]);

    return (
        <div className="App">
            <nav className="navbar">
                <div className="logo">Mert's E-commerce</div>
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
                    <h1>E-commerce Website 2025</h1>
                    <p>Discover amazing products at unbeatable prices</p>
                    <button className="cta-button">Shop Now</button>
                </div>
            </section>

            <section className="payment-section">
                <div className="section-header">
                    <h2>Products</h2>
                    {paymentInfo && paymentInfo.products && (
                        <div className="product-count">
                            {paymentInfo.products.length} products listed
                        </div>
                    )}
                </div>
                {loading && currentPage === 1 && (
                    <div className="loading-message">Loading products...</div>
                )}
                {error && <div className="error-message">{error}</div>}
                {displayedProducts.length > 0 ? (
                    <div className="products-grid">
                        {displayedProducts.map((product, index) => (
                            <div
                                key={product.pid}
                                ref={
                                    index === displayedProducts.length - 1
                                        ? lastProductElementRef
                                        : null
                                }
                            >
                                <Product
                                    product={product}
                                    onModalStateChange={setIsModalOpen}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    !loading &&
                    !error && (
                        <div className="no-products">
                            No products available right now 😔
                        </div>
                    )
                )}
                {loading && currentPage > 1 && (
                    <div className="loading-message" ref={loadingRef}>
                        Loading more products...
                    </div>
                )}
                {!hasMore && displayedProducts.length > 0 && (
                    <div className="end-message">No more products to load</div>
                )}
            </section>

            <footer className="footer">
                <p>&copy; 2025 Mert's E-commerce. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default App;
