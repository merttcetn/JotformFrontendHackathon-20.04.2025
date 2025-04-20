import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/cartSlice";

// icons
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import TagIcon from "@mui/icons-material/Tag";
import PaymentIcon from "@mui/icons-material/Payment";
import LinkIcon from "@mui/icons-material/Link";
import SortIcon from "@mui/icons-material/Sort";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

import "./Modal.css";

const Modal = ({ product, onClose }) => {
    const dispatch = useDispatch();
    const [selectedOption, setSelectedOption] = useState(0);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [currentProduct, setCurrentProduct] = useState(product);

    // Redux store'dan tüm ürünleri al
    const allProducts = useSelector((state) => state.products.products);

    // Benzer ürünleri bul
    useEffect(() => {
        if (allProducts.length > 0 && currentProduct) {
            // Aynı kategorideki ürünleri bul (cid'ye göre)
            const sameCategoryProducts = allProducts.filter(
                (p) =>
                    p.cid === currentProduct.cid && // Aynı kategori
                    p.pid !== currentProduct.pid // Farklı ürün
            );

            // En fazla 3 benzer ürün göster
            const randomSimilarProducts = sameCategoryProducts
                .sort(() => 0.5 - Math.random()) // Rastgele sırala
                .slice(0, 3);

            setSimilarProducts(randomSimilarProducts);
        }
    }, [allProducts, currentProduct]);

    // Ürünü değiştir ve benzer ürünleri güncelle
    const changeProduct = (newProduct) => {
        setCurrentProduct(newProduct);
        // Diğer state'leri de sıfırla
        setSelectedOption(0);
        setSelectedQuantity(1);
    };

    // extract image url from the product
    const getImageUrl = (p = currentProduct) => {
        if (p.image) return p.image;
        if (p.images) {
            try {
                const parsedImages = JSON.parse(p.images);
                return parsedImages[0] || "";
            } catch (e) {
                return p.images;
            }
        }
        return "";
    };

    // Parse images array if it's a string
    const parseJsonField = (field) => {
        if (!field) return [];
        if (typeof field === "string") {
            try {
                return JSON.parse(field);
            } catch (e) {
                return field;
            }
        }
        return field;
    };

    // Format connected information
    const formatConnectedInfo = (connectedData) => {
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

    // Format boolean or yes/no values
    const formatBooleanValue = (value) => {
        if (value === "Yes" || value === "No") return value;
        if (value === true || value === "true") return "Yes";
        if (value === false || value === "false") return "No";
        return value || "N/A";
    };

    // Get product options if they exist
    const getProductOptions = () => {
        const options = parseJsonField(currentProduct.options);
        return Array.isArray(options) ? options : [];
    };

    // Get price options if special pricing exists
    const getPriceOptions = () => {
        const options = getProductOptions();
        if (!options || options.length === 0) return null;

        // Find the option with specialPricing = true or has specialPrices
        const specialPricingOption = options.find(
            (opt) => opt.specialPricing === true || opt.specialPrices
        );

        if (!specialPricingOption) return null;

        let prices = [];
        let variants = [];

        if (specialPricingOption.specialPrices) {
            prices = specialPricingOption.specialPrices
                .split(",")
                .map((p) => parseFloat(p).toFixed(2));
        }

        if (specialPricingOption.properties) {
            variants = specialPricingOption.properties.split("\n");
        }

        // Match prices with variants
        return variants.map((variant, index) => ({
            name: variant,
            price: prices[index] || 0,
        }));
    };

    // Calculate current price based on selection
    const getCurrentPrice = () => {
        const priceOptions = getPriceOptions();

        if (
            priceOptions &&
            priceOptions.length > 0 &&
            priceOptions[selectedOption]
        ) {
            return parseFloat(priceOptions[selectedOption].price).toFixed(2);
        }

        return parseFloat(currentProduct.price || 0).toFixed(2);
    };

    const handleAddToCart = () => {
        // add to the redux store with all product information
        const priceOptions = getPriceOptions();
        let finalPrice = parseFloat(currentProduct.price || 0);
        let optionName = "";

        if (
            priceOptions &&
            priceOptions.length > 0 &&
            priceOptions[selectedOption]
        ) {
            finalPrice = parseFloat(priceOptions[selectedOption].price);
            optionName = priceOptions[selectedOption].name;
        }

        dispatch(
            addToCart({
                ...currentProduct, // all the product properties
                image: getImageUrl(), // get image url
                // Parse JSON strings to objects where needed
                images: parseJsonField(currentProduct.images),
                connectedCategories: parseJsonField(
                    currentProduct.connectedCategories
                ),
                connectedProducts: parseJsonField(
                    currentProduct.connectedProducts
                ),
                options: parseJsonField(currentProduct.options),
                selectedOption: optionName,
                selectedOptionIndex: selectedOption,
                quantity: selectedQuantity,
                finalPrice: finalPrice,
                totalPrice: (finalPrice * selectedQuantity).toFixed(2),
            })
        );
        onClose();
    };

    if (!currentProduct) return null;

    // desired attributes
    const { name, description, price, cid, pid } = currentProduct;
    const priceOptions = getPriceOptions();
    const hasSpecialPricing =
        currentProduct.hasSpecialPricing === "1" ||
        currentProduct.hasSpecialPricing === true;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    <CloseIcon />
                </button>

                <div className="modal-header">
                    <h2 className="modal-title">
                        {name || currentProduct.title}
                    </h2>
                </div>

                <div className="modal-product">
                    <div className="modal-image">
                        <img
                            src={getImageUrl()}
                            alt={name || currentProduct.title}
                        />
                    </div>
                    <div className="modal-details">
                        <div className="modal-basic-info">
                            {description && (
                                <p className="modal-description">
                                    {description}
                                </p>
                            )}

                            {hasSpecialPricing &&
                            priceOptions &&
                            priceOptions.length > 0 ? (
                                <div className="modal-options">
                                    <div className="option-group">
                                        <h3>Options</h3>
                                        <div className="option-buttons">
                                            {priceOptions.map(
                                                (option, index) => (
                                                    <button
                                                        key={index}
                                                        className={`option-button ${
                                                            selectedOption ===
                                                            index
                                                                ? "selected"
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            setSelectedOption(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        {option.name} - $
                                                        {option.price}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <div className="quantity-selector">
                                        <h3>Quantity</h3>
                                        <div className="quantity-controls">
                                            <button
                                                onClick={() =>
                                                    setSelectedQuantity(
                                                        Math.max(
                                                            1,
                                                            selectedQuantity - 1
                                                        )
                                                    )
                                                }
                                                disabled={selectedQuantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span>{selectedQuantity}</span>
                                            <button
                                                onClick={() =>
                                                    setSelectedQuantity(
                                                        selectedQuantity + 1
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            <div className="modal-price-container">
                                <div className="modal-price">
                                    ${getCurrentPrice()}
                                    {selectedQuantity > 1 && (
                                        <span className="modal-subtotal">
                                            Subtotal: $
                                            {(
                                                parseFloat(getCurrentPrice()) *
                                                selectedQuantity
                                            ).toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                <button
                                    className="modal-add-to-cart"
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingCartIcon /> Add to Cart
                                </button>
                            </div>
                        </div>

                        <div className="product-tags-container">
                            <h3 className="tags-title">Product Information</h3>
                            <div className="product-tags">
                                {cid && (
                                    <span className="product-tag">
                                        <CategoryIcon className="tag-icon" />
                                        Category: {cid}
                                    </span>
                                )}

                                <span className="product-tag">
                                    <TagIcon className="tag-icon" />
                                    Product ID: {pid}
                                </span>

                                {currentProduct.paymentUUID && (
                                    <span className="product-tag">
                                        <PaymentIcon className="tag-icon" />
                                        Payment ID:{" "}
                                        {currentProduct.paymentUUID.substring(
                                            0,
                                            10
                                        )}
                                        ...
                                    </span>
                                )}

                                {hasSpecialPricing && (
                                    <span className="product-tag">
                                        <LocalOfferIcon className="tag-icon" />
                                        Special Pricing: Yes
                                    </span>
                                )}

                                {currentProduct.connectedCategories &&
                                    currentProduct.connectedCategories !==
                                        "[]" && (
                                        <span className="product-tag">
                                            <LinkIcon className="tag-icon" />
                                            Connected Categories:{" "}
                                            {formatConnectedInfo(
                                                currentProduct.connectedCategories
                                            )}
                                        </span>
                                    )}

                                {currentProduct.connectedProducts &&
                                    currentProduct.connectedProducts !==
                                        "[]" && (
                                        <span className="product-tag">
                                            <LinkIcon className="tag-icon" />
                                            Connected Products:{" "}
                                            {formatConnectedInfo(
                                                currentProduct.connectedProducts
                                            )}
                                        </span>
                                    )}

                                {currentProduct.corder && (
                                    <span className="product-tag">
                                        <SortIcon className="tag-icon" />
                                        Category Order: {currentProduct.corder}
                                    </span>
                                )}

                                {currentProduct.order && (
                                    <span className="product-tag">
                                        <SortIcon className="tag-icon" />
                                        Order: {currentProduct.order}
                                    </span>
                                )}

                                {currentProduct.fitImageToCanvas && (
                                    <span className="product-tag">
                                        <AspectRatioIcon className="tag-icon" />
                                        Fit Image:{" "}
                                        {formatBooleanValue(
                                            currentProduct.fitImageToCanvas
                                        )}
                                    </span>
                                )}

                                {currentProduct.isLowStockAlertEnabled && (
                                    <span className="product-tag">
                                        <InventoryIcon className="tag-icon" />
                                        Low Stock Alert:{" "}
                                        {formatBooleanValue(
                                            currentProduct.isLowStockAlertEnabled
                                        )}
                                    </span>
                                )}

                                {currentProduct.isStockControlEnabled && (
                                    <span className="product-tag">
                                        <InventoryIcon className="tag-icon" />
                                        Stock Control:{" "}
                                        {formatBooleanValue(
                                            currentProduct.isStockControlEnabled
                                        )}
                                    </span>
                                )}

                                {currentProduct.lowStockValue && (
                                    <span className="product-tag">
                                        <InventoryIcon className="tag-icon" />
                                        Low Stock Value:{" "}
                                        {currentProduct.lowStockValue}
                                    </span>
                                )}

                                {currentProduct.hasExpandedOption && (
                                    <span className="product-tag">
                                        <TagIcon className="tag-icon" />
                                        Has Expanded Option:{" "}
                                        {formatBooleanValue(
                                            currentProduct.hasExpandedOption
                                        )}
                                    </span>
                                )}

                                {currentProduct.hasQuantity && (
                                    <span className="product-tag">
                                        <InventoryIcon className="tag-icon" />
                                        Has Quantity:{" "}
                                        {formatBooleanValue(
                                            currentProduct.hasQuantity
                                        )}
                                    </span>
                                )}

                                {currentProduct.hasSpecialPricing && (
                                    <span className="product-tag">
                                        <TagIcon className="tag-icon" />
                                        Has Special Pricing:{" "}
                                        {formatBooleanValue(
                                            currentProduct.hasSpecialPricing
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benzer Ürünler Bölümü */}
                {similarProducts && similarProducts.length > 0 && (
                    <div className="similar-products-section">
                        <h3>Similar Products</h3>
                        <div className="similar-products">
                            {similarProducts.map((similarProduct) => (
                                <div
                                    key={similarProduct.pid}
                                    className="similar-product"
                                    onClick={() =>
                                        changeProduct(similarProduct)
                                    }
                                >
                                    <div className="similar-product-image">
                                        <img
                                            src={getImageUrl(similarProduct)}
                                            alt={
                                                similarProduct.name ||
                                                similarProduct.title
                                            }
                                        />
                                    </div>
                                    <div className="similar-product-info">
                                        <h4>
                                            {similarProduct.name ||
                                                similarProduct.title}
                                        </h4>
                                        <p className="similar-product-price">
                                            $
                                            {parseFloat(
                                                similarProduct.price || 0
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
