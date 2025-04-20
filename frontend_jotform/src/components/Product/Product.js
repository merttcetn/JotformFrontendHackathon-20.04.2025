import React, { useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import "./Product.css";
import Modal from "../Modal/Modal";

const Product = ({ product, onModalStateChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const handleModalOpen = () => {
        setIsModalOpen(true);
        onModalStateChange(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        onModalStateChange(false);
    };

    const toggleDetails = (e) => {
        e.stopPropagation();
        setShowDetails(!showDetails);
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

    // Format connected information
    const formatConnectedInfo = (connectedData) => {
        if (!connectedData) return "None";

        const parsed = parseJsonField(connectedData);

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
                        ${parseFloat(product.price).toFixed(2)}
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

                        <div
                            className="product-info-icon"
                            onClick={toggleDetails}
                        >
                            <InfoIcon />
                        </div>
                    </div>

                    {showDetails && (
                        <div
                            className="product-additional-details"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h4>Product Details</h4>
                            <ul>
                                {product.paymentUUID && (
                                    <li>Payment UUID: {product.paymentUUID}</li>
                                )}
                                {product.connectedCategories && (
                                    <li>
                                        Connected Categories:{" "}
                                        {formatConnectedInfo(
                                            product.connectedCategories
                                        )}
                                    </li>
                                )}
                                {product.connectedProducts && (
                                    <li>
                                        Connected Products:{" "}
                                        {formatConnectedInfo(
                                            product.connectedProducts
                                        )}
                                    </li>
                                )}
                                {product.corder && (
                                    <li>Category Order: {product.corder}</li>
                                )}
                                {product.order && (
                                    <li>Order: {product.order}</li>
                                )}
                                {product.fitImageToCanvas && (
                                    <li>
                                        Fit Image to Canvas:{" "}
                                        {formatBooleanValue(
                                            product.fitImageToCanvas
                                        )}
                                    </li>
                                )}
                                {product.isLowStockAlertEnabled && (
                                    <li>
                                        Low Stock Alert:{" "}
                                        {formatBooleanValue(
                                            product.isLowStockAlertEnabled
                                        )}
                                    </li>
                                )}
                                {product.isStockControlEnabled && (
                                    <li>
                                        Stock Control:{" "}
                                        {formatBooleanValue(
                                            product.isStockControlEnabled
                                        )}
                                    </li>
                                )}
                                {product.lowStockValue && (
                                    <li>
                                        Low Stock Value: {product.lowStockValue}
                                    </li>
                                )}
                                {product.hasExpandedOption && (
                                    <li>
                                        Has Expanded Option:{" "}
                                        {formatBooleanValue(
                                            product.hasExpandedOption
                                        )}
                                    </li>
                                )}
                                {product.hasQuantity && (
                                    <li>
                                        Has Quantity:{" "}
                                        {formatBooleanValue(
                                            product.hasQuantity
                                        )}
                                    </li>
                                )}
                                {product.hasSpecialPricing && (
                                    <li>
                                        Has Special Pricing:{" "}
                                        {formatBooleanValue(
                                            product.hasSpecialPricing
                                        )}
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    <button
                        className="add-to-cart"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleModalOpen();
                        }}
                    >
                        View Details
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
