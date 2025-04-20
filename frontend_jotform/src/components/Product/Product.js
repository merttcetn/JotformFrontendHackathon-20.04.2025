import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import "./Product.css";
import Modal from "../Modal/Modal";

const Product = ({ product, onModalStateChange }) => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleModalOpen = () => {
        setIsModalOpen(true);
        onModalStateChange(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        onModalStateChange(false);
    };

    // Parse JSON fields
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

    // Get image URL
    const getImageUrl = () => {
        if (product.images) {
            const parsedImages = parseJsonField(product.images);
            return Array.isArray(parsedImages) && parsedImages.length > 0
                ? parsedImages[0]
                : "https://via.placeholder.com/200";
        }
        return "https://via.placeholder.com/200";
    };

    // Get product price based on options and special pricing
    const getProductPrice = () => {
        // Check if product has special pricing
        if (
            product.hasSpecialPricing === "1" ||
            product.hasSpecialPricing === true
        ) {
            const options = parseJsonField(product.options);

            // Find the option with specialPricing = true
            if (Array.isArray(options) && options.length > 0) {
                const specialPricingOption = options.find(
                    (opt) => opt.specialPricing === true
                );

                if (
                    specialPricingOption &&
                    specialPricingOption.specialPrices
                ) {
                    // Get first price from specialPrices if it exists
                    const prices =
                        specialPricingOption.specialPrices.split(",");
                    if (prices.length > 0 && prices[0]) {
                        return parseFloat(prices[0]).toFixed(2);
                    }
                }

                // For option structures like in the second example
                for (const option of options) {
                    if (option.specialPrices) {
                        const prices = option.specialPrices.split(",");
                        if (prices.length > 0 && prices[0]) {
                            return parseFloat(prices[0]).toFixed(2);
                        }
                    }
                }
            }
        }

        // Return regular price if no special pricing is found
        return parseFloat(product.price || 0).toFixed(2);
    };

    // Handle add to cart directly
    const handleAddToCart = (e) => {
        e.stopPropagation();
        const productPrice = getProductPrice();

        const cartItem = {
            ...product,
            image: getImageUrl(),
            images: parseJsonField(product.images),
            connectedCategories: parseJsonField(product.connectedCategories),
            connectedProducts: parseJsonField(product.connectedProducts),
            options: parseJsonField(product.options),
            displayPrice: productPrice, // Store the displayed price
            finalPrice: parseFloat(productPrice), // Final price for calculations
            price: parseFloat(product.price || 0), // Keep original price
            quantity: 1, // Default quantity
            totalPrice: productPrice, // Total for this item
        };

        // Log what we're about to add to cart
        console.log("Adding to cart:", {
            productId: product.pid,
            name: product.name || product.title,
            price: product.price,
            finalPrice: parseFloat(productPrice),
            cartItem: cartItem,
        });

        dispatch(addToCart(cartItem));
    };

    return (
        <>
            <div className="product-card" onClick={handleModalOpen}>
                <div className="product-image">
                    <img src={getImageUrl()} alt={product.name} />
                </div>
                <div className="product-details">
                    <h3 className="product-name">{product.name}</h3>
                    {product.description && (
                        <p className="product-description">
                            {product.description}
                        </p>
                    )}
                    <div className="product-price">
                        ${getProductPrice()}
                        {product.hasSpecialPricing === "1" && (
                            <span className="price-note">starting from</span>
                        )}
                    </div>

                    <div className="product-meta">
                        <div className="product-ids">
                            {product.cid && (
                                <span className="product-id">
                                    Category ID: {product.cid}
                                </span>
                            )}
                            <span className="product-id">
                                Product ID: {product.pid}
                            </span>
                        </div>
                    </div>

                    <button className="add-to-cart" onClick={handleAddToCart}>
                        <ShoppingCartIcon
                            style={{ fontSize: 20, marginRight: 8 }}
                        />
                        Add to Cart
                    </button>
                </div>
            </div>
            {isModalOpen && (
                <Modal product={product} onClose={handleModalClose} />
            )}
        </>
    );
};

export default Product;
