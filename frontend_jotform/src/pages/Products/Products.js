import React, { useState, useEffect } from "react";
import { fetchPaymentInfo } from "../../services/api";
import Product from "../../components/Product/Product";
import "./Products.css";

const Products = ({ formId }) => {
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayedProducts, setDisplayedProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // fetch payment info from api
                const data = await fetchPaymentInfo(formId);
                if (data && data.content) {
                    setPaymentInfo(data.content);
                    setDisplayedProducts(data.content.products);
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
    }, [formId]);

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

    return (
        <div className="products-page">
            <div className="products-header">
                <h1>All Products</h1>
                {paymentInfo && paymentInfo.products && (
                    <div className="products-count">
                        {paymentInfo.products.length} products listed
                    </div>
                )}
            </div>

            {loading && (
                <div className="products-loading">Loading products...</div>
            )}

            {error && <div className="products-error">{error}</div>}

            {displayedProducts.length > 0 ? (
                <div className="products-grid-full">
                    {displayedProducts.map((product) => (
                        <div key={product.pid}>
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
        </div>
    );
};

export default Products;
