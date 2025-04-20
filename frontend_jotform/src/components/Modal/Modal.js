import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import CloseIcon from "@mui/icons-material/Close";
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

    const handleAddToCart = () => {
        // add to the redux store
        dispatch(
            addToCart({
                ...product, // all the product properties
                image: getImageUrl(), // get image url
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
                <div className="modal-product">
                    <div className="modal-image">
                        <img src={getImageUrl()} alt={name || product.title} />
                    </div>
                    <div className="modal-details">
                        <h2 className="modal-title">{name || product.title}</h2>
                        {description && (
                            <p className="modal-description">{description}</p>
                        )}
                        <div className="modal-price">
                            ${parseFloat(price).toFixed(2)}
                        </div>
                        <div className="modal-ids">
                            {cid && <span>Category ID: {cid}</span>}
                            <span>Product ID: {pid}</span>
                        </div>
                        <button
                            className="modal-add-to-cart"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
