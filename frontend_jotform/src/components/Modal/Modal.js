import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import "./Modal.css";

const Modal = ({ product, onClose }) => {
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        dispatch(
            addToCart({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1,
            })
        );
        onClose();
    };

    if (!product) return null;

    const { name, description, price, images, cid, pid } = product;

    const imageUrls = JSON.parse(images || "[]");
    const mainImage = imageUrls[0] || "https://via.placeholder.com/200";

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    ×
                </button>
                <div className="modal-product">
                    <div className="modal-image">
                        <img src={mainImage} alt={name} />
                    </div>
                    <div className="modal-details">
                        <h2 className="modal-title">{name}</h2>
                        <p className="modal-description">{description}</p>
                        <div className="modal-price">
                            ${parseFloat(price).toFixed(2)}
                        </div>
                        <div className="modal-ids">
                            <span>Category ID: {cid}</span>
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
