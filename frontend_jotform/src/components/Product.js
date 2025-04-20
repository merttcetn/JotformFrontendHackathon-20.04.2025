import React from "react";
import "./Product.css";

const Product = ({ product }) => {
    const { name, description, price, images, cid, pid } = product;

    // Parse the images array from string
    const imageUrls = JSON.parse(images || "[]");
    const mainImage = imageUrls[0] || "https://via.placeholder.com/200";

    return (
        <div className="product-card">
            <div className="product-image">
                <img src={mainImage} alt={name} />
            </div>
            <div className="product-details">
                <h3 className="product-name">{name}</h3>
                <p className="product-description">{description}</p>
                <div className="product-price">
                    ${parseFloat(price).toFixed(2)}
                </div>
                <div className="product-ids">
                    <span className="product-id">Category ID: {cid}</span>
                    <span className="product-id">Product ID: {pid}</span>
                </div>
                <button className="add-to-cart">Add to Cart</button>
            </div>
        </div>
    );
};

export default Product;
