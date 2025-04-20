import React, { useState, useEffect } from "react";
import { fetchPaymentInfo } from "../../services/api";
import Product from "../../components/Product/Product";
import SearchIcon from "@mui/icons-material/Search";
import "./Products.css";

const Products = ({ formId }) => {
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

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
                    setFilteredProducts(data.content.products);

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

    // Search ve kategori filtrelerini uygulayan genel fonksiyon
    useEffect(() => {
        if (!paymentInfo) return;

        // Önce kategori filtresini uygula
        let results = paymentInfo.products;

        if (selectedCategory !== "all") {
            results = results.filter((product) => {
                if (product.category) {
                    return product.category === selectedCategory;
                } else if (product.cid) {
                    return `Category ${product.cid}` === selectedCategory;
                }
                return false;
            });
        }

        // Sonra arama filtresi uygula
        if (searchTerm.trim() !== "") {
            const searchLower = searchTerm.toLowerCase();
            results = results.filter((product) => {
                const name = (
                    product.name ||
                    product.title ||
                    ""
                ).toLowerCase();
                const description = (product.description || "").toLowerCase();
                const id = (product.pid || "").toString().toLowerCase();

                return (
                    name.includes(searchLower) ||
                    description.includes(searchLower) ||
                    id.includes(searchLower)
                );
            });
        }

        setFilteredProducts(results);
    }, [paymentInfo, selectedCategory, searchTerm]);

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

    // Kategori değiştiğinde state güncelle
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    // Arama terimi değiştiğinde state güncelle
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Arama formu submit edildiğinde sayfanın yenilenmesini engelle
    const handleSearchSubmit = (e) => {
        e.preventDefault();
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
                        {filteredProducts.length} of{" "}
                        {paymentInfo.products.length} products listed
                    </div>
                )}
            </div>

            <div className="products-filters">
                {/* Arama kutusu */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="search-container"
                >
                    <div className="search-input-wrapper">
                        <SearchIcon className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </form>

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
                                {category === "all"
                                    ? "All Categories"
                                    : category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading && (
                <div className="products-loading">Loading products...</div>
            )}

            {error && <div className="products-error">{error}</div>}

            {filteredProducts.length > 0 ? (
                <div className="products-grid-full">
                    {filteredProducts.map((product) => (
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
                        No products available with the selected filters 😔
                    </div>
                )
            )}
        </div>
    );
};

export default Products;
