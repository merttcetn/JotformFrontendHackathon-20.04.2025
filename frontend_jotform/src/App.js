import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./App.css";
import { fetchPaymentInfo, fetchFormDetails } from "./services/api";
import Product from "./components/Product/Product";
import Navbar from "./components/Navbar/Navbar";
import Checkout from "./pages/Checkout/Checkout";
import Products from "./pages/Products/Products";
import { setProducts } from "./store/productSlice";

function App() {
    const dispatch = useDispatch();
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [formTitle, setFormTitle] = useState("");

    // form id for jotform apis
    const FORM_ID_1 = "251073674521959";
    const FORM_ID_2 = "251074257490962";
    const FORM_ID_3 = "251074104261949";

    const selectedFORM_ID = FORM_ID_3; // Change this to the desired form ID
    const API_KEY = "297573601db060dc8f2ad816457a599e";

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

    // Form detaylarını ve başlığını al
    useEffect(() => {
        const fetchFormTitle = async () => {
            try {
                const formData = await fetchFormDetails(selectedFORM_ID);
                if (formData && formData.content) {
                    const formInfo = formData.content;
                    if (formInfo.title) {
                        console.log("Form title:", formInfo.title);
                        setFormTitle(formInfo.title);
                    }
                }
            } catch (err) {
                console.error("Error fetching form details:", err);
            }
        };

        fetchFormTitle();
    }, [selectedFORM_ID]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // fetch payment info from api
                const data = await fetchPaymentInfo(selectedFORM_ID);
                if (data && data.content) {
                    setPaymentInfo(data.content);

                    // first 8 products
                    setDisplayedProducts(data.content.products.slice(0, 8));

                    // Tüm ürünleri Redux store'a ekle
                    dispatch(setProducts(data.content.products));
                } else {
                    setError("Invalid response format");
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch payment information");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dispatch, selectedFORM_ID]);

    const HomePage = () => (
        <>
            <section
                className="hero"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    color: "white",
                }}
            >
                <div className="hero-content">
                    <h1>{formTitle} Website 2025</h1>
                    <p>Discover amazing products at unbeatable prices</p>
                </div>
            </section>

            <section className="payment-section">
                <div className="section-header">
                    <h2>Featured Products</h2>
                </div>

                {loading && (
                    <div className="loading-message">Loading products...</div>
                )}
                {error && <div className="error-message">{error}</div>}

                {displayedProducts.length > 0 ? (
                    <>
                        <div className="products-grid">
                            {displayedProducts.map((product) => (
                                <div key={product.pid}>
                                    <Product
                                        product={product}
                                        onModalStateChange={setIsModalOpen}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="product-count-container">
                            {paymentInfo && paymentInfo.products && (
                                <div className="product-count">
                                    {displayedProducts.length} of{" "}
                                    {paymentInfo.products.length} products
                                </div>
                            )}

                            <Link
                                to="/products"
                                className="show-all-products-btn"
                            >
                                Show All Products
                            </Link>
                        </div>
                    </>
                ) : (
                    !loading &&
                    !error && (
                        <div className="no-products">
                            No products available right now 😔
                        </div>
                    )
                )}
            </section>
        </>
    );

    return (
        <div className="App">
            <Navbar title={formTitle} />

            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                        path="/checkout"
                        element={
                            <Checkout
                                formId={selectedFORM_ID}
                                apiKey={API_KEY}
                            />
                        }
                    />
                    <Route
                        path="/products"
                        element={<Products formId={selectedFORM_ID} />}
                    />
                </Routes>
            </main>

            <footer className="footer">
                <p>&copy; 2025 {formTitle}. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default App;
