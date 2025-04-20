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
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");

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

                    // Kategorileri çıkar
                    const uniqueCategories = extractCategories(
                        data.content.products
                    );
                    setCategories(uniqueCategories);
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

    // Ürünlerden kategori listesi çıkaran yardımcı fonksiyon
    const extractCategories = (products) => {
        const categoriesSet = new Set();
        products.forEach((product) => {
            if (product.category) {
                categoriesSet.add(product.category);
            } else if (product.cid) {
                categoriesSet.add(`Category ${product.cid}`);
            }
        });
        return ["all", ...Array.from(categoriesSet)];
    };

    // Kategori değiştiğinde ürünleri filtrele
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);

        if (category === "all") {
            setDisplayedProducts(paymentInfo.products);
        } else {
            const filtered = paymentInfo.products.filter((product) => {
                if (product.category) {
                    return product.category === category;
                } else if (product.cid) {
                    return `Category ${product.cid}` === category;
                }
                return false;
            });
            setDisplayedProducts(filtered);
        }
    };

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
                        {displayedProducts.length} of{" "}
                        {paymentInfo.products.length} products listed
                    </div>
                )}
            </div>

            {/* Kategori filtre menüsü */}
            <div className="category-filter">
                <label htmlFor="category-select">Filter by Category:</label>
                <select
                    id="category-select"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                >
                    {categories.map((category, index) => (
                        <option key={index} value={category}>
                            {category === "all" ? "All Categories" : category}
                        </option>
                    ))}
                </select>
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
                        No products available with the selected filter 😔
                    </div>
                )
            )}
        </div>
    );
};

export default Products;
