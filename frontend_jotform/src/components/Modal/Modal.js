import React from "react";
import { useDispatch } from "react-redux";
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

import "./Modal.css";

const Modal = ({ product, onClose }) => {
    const dispatch = useDispatch();

    // extract image url from the product
    const getImageUrl = () => {
        if (product.image) return product.image;
        if (product.images) {
            try {
                const parsedImages = JSON.parse(product.images);
                return parsedImages[0] || "";
            } catch (e) {
                return product.images;
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

    const handleAddToCart = () => {
        // add to the redux store with all product information
        dispatch(
            addToCart({
                ...product, // all the product properties
                image: getImageUrl(), // get image url
                // Parse JSON strings to objects where needed
                images: parseJsonField(product.images),
                connectedCategories: parseJsonField(
                    product.connectedCategories
                ),
                connectedProducts: parseJsonField(product.connectedProducts),
                options: parseJsonField(product.options),
            })
        );
        onClose();
    };

    if (!product) return null;

    // desired attributes
    const { name, description, price, cid, pid } = product;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    <CloseIcon />
                </button>

                <div className="modal-header">
                    <h2 className="modal-title">{name || product.title}</h2>
                </div>

                <div className="modal-product">
                    <div className="modal-image">
                        <img src={getImageUrl()} alt={name || product.title} />
                    </div>
                    <div className="modal-details">
                        <div className="modal-basic-info">
                            {description && (
                                <p className="modal-description">
                                    {description}
                                </p>
                            )}

                            <div className="modal-price-container">
                                <div className="modal-price">
                                    ${parseFloat(price).toFixed(2)}
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

                                {product.paymentUUID && (
                                    <span className="product-tag">
                                        <PaymentIcon className="tag-icon" />
                                        Payment ID:{" "}
                                        {product.paymentUUID.substring(0, 10)}
                                        ...
                                    </span>
                                )}

                                {product.connectedCategories &&
                                    product.connectedCategories !== "[]" && (
                                        <span className="product-tag">
                                            <LinkIcon className="tag-icon" />
                                            Connected Categories:{" "}
                                            {formatConnectedInfo(
                                                product.connectedCategories
                                            )}
                                        </span>
                                    )}

                                {product.connectedProducts &&
                                    product.connectedProducts !== "[]" && (
                                        <span className="product-tag">
                                            <LinkIcon className="tag-icon" />
                                            Connected Products:{" "}
                                            {formatConnectedInfo(
                                                product.connectedProducts
                                            )}
                                        </span>
                                    )}

                                {product.corder && (
                                    <span className="product-tag">
                                        <SortIcon className="tag-icon" />
                                        Category Order: {product.corder}
                                    </span>
                                )}

                                {product.order && (
                                    <span className="product-tag">
                                        <SortIcon className="tag-icon" />
                                        Order: {product.order}
                                    </span>
                                )}

                                {product.fitImageToCanvas && (
                                    <span className="product-tag">
                                        <AspectRatioIcon className="tag-icon" />
                                        Fit Image:{" "}
                                        {formatBooleanValue(
                                            product.fitImageToCanvas
                                        )}
                                    </span>
                                )}

                                {product.isLowStockAlertEnabled && (
                                    <span className="product-tag">
                                        <InventoryIcon className="tag-icon" />
                                        Low Stock Alert:{" "}
                                        {formatBooleanValue(
                                            product.isLowStockAlertEnabled
                                        )}
                                    </span>
                                )}

                                {product.isStockControlEnabled && (
                                    <span className="product-tag">
                                        <InventoryIcon className="tag-icon" />
                                        Stock Control:{" "}
                                        {formatBooleanValue(
                                            product.isStockControlEnabled
                                        )}
                                    </span>
                                )}

                                {product.lowStockValue && (
                                    <span className="product-tag">
                                        <InventoryIcon className="tag-icon" />
                                        Low Stock Value: {product.lowStockValue}
                                    </span>
                                )}

                                {product.hasExpandedOption && (
                                    <span className="product-tag">
                                        <TagIcon className="tag-icon" />
                                        Has Expanded Option:{" "}
                                        {formatBooleanValue(
                                            product.hasExpandedOption
                                        )}
                                    </span>
                                )}

                                {product.hasQuantity && (
                                    <span className="product-tag">
                                        <InventoryIcon className="tag-icon" />
                                        Has Quantity:{" "}
                                        {formatBooleanValue(
                                            product.hasQuantity
                                        )}
                                    </span>
                                )}

                                {product.hasSpecialPricing && (
                                    <span className="product-tag">
                                        <TagIcon className="tag-icon" />
                                        Has Special Pricing:{" "}
                                        {formatBooleanValue(
                                            product.hasSpecialPricing
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
