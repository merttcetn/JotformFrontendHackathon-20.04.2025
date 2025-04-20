import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../store/cartSlice";
import "./Checkout.css";

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const total = useSelector((state) => state.cart.total);
    const selectedProductsList = useSelector(
        (state) => state.cart.selectedProductsList
    );

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const getProductPrice = (item) => {
        return item.finalPrice || item.price;
    };

    const handleGoBack = () => {
        navigate("/");
    };

    const handleSubmitOrder = async () => {
        // Form validation
        if (!firstName.trim()) {
            setErrorMessage("Please enter your first name");
            return;
        }

        if (!lastName.trim()) {
            setErrorMessage("Please enter your last name");
            return;
        }

        if (!address.trim()) {
            setErrorMessage("Please enter your address");
            return;
        }

        setErrorMessage("");
        setIsSubmitting(true);

        // Console'da submisyon başladığını görelim
        console.log("Starting order submission process...");

        const formID = "251074257490962"; // FORM ID 2
        const apiKey = "297573601db060dc8f2ad816457a599e";

        // Ürün detaylarını formatla (debug için)
        const productDetails = cartItems
            .map(
                (item) =>
                    `${item.name || item.title} (${item.pid}) x${
                        item.quantity
                    } = $${parseFloat(
                        getProductPrice(item) * item.quantity
                    ).toFixed(2)}`
            )
            .join(", ");

        const orderTotal = (total + total * 0.08).toFixed(2);
        const orderDate = new Date().toLocaleString();

        // JotForm formata dönüştürülen ürün listesini JSON string olarak hazırla
        const selectedProductsListString = JSON.stringify(selectedProductsList);

        console.log("Preparing order data:", {
            products: productDetails,
            customer: { firstName, lastName, address },
            orderDetails: { total: orderTotal, date: orderDate },
            selectedProductsList: selectedProductsList,
        });

        // Curl formatına uygun form verileri hazırla
        const formData = new URLSearchParams();

        // JotForm formatında ürün bilgilerini ekle
        formData.append("submission[59]", selectedProductsListString);

        // Müşteri adı
        formData.append("submission[121_first]", firstName);
        formData.append("submission[121_last]", lastName);

        // Adres bilgisi
        formData.append("submission[122]", address);

        // Toplam tutar
        formData.append("submission[123]", orderTotal);

        // Sipariş tarihi
        formData.append("submission[124]", orderDate);

        // Submission URL'i
        const submissionUrl = `https://api.jotform.com/form/${formID}/submissions?apiKey=${apiKey}`;
        console.log("Submitting to:", submissionUrl);
        console.log("Form data:", formData.toString());

        try {
            console.log("Sending submission request...");
            const response = await fetch(submissionUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData.toString(),
            });

            const result = await response.json();
            console.log("JotForm API response:", result);

            setIsSubmitting(false);

            if (result.responseCode === 200) {
                console.log("Order submission successful!");
                dispatch(clearCart());
                alert(
                    "Thank you for your order! It has been submitted successfully."
                );
                navigate("/");
            } else {
                console.error("JotForm API Error:", result);
                setErrorMessage(
                    `Failed to submit order: ${
                        result.message || "Unknown error"
                    }`
                );
            }
        } catch (error) {
            console.error("Submission Error:", error);
            setIsSubmitting(false);
            setErrorMessage(
                "An error occurred during order submission. Please try again later."
            );
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="checkout-container">
                <div className="checkout-empty">
                    <h2>Your cart is empty</h2>
                    <p>
                        Please add some items to your cart before checking out.
                    </p>
                    <button className="return-button" onClick={handleGoBack}>
                        Return to Shop
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <h1 className="checkout-title">Order Summary</h1>

            <div className="checkout-layout">
                <div className="checkout-order-summary">
                    {/* Kullanıcı Bilgi Giriş Alanı */}
                    <div className="checkout-user-info">
                        <h2>Your Information</h2>

                        {errorMessage && (
                            <div className="error-message">{errorMessage}</div>
                        )}

                        <div className="name-inputs">
                            <label className="first-name">
                                First Name:
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                    placeholder="Enter your first name"
                                    required
                                />
                            </label>
                            <label className="last-name">
                                Last Name:
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                    placeholder="Enter your last name"
                                    required
                                />
                            </label>
                        </div>
                        <label>
                            Address:
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter your address"
                                required
                            />
                        </label>
                    </div>

                    <h2>Your Cart Items</h2>
                    <div className="checkout-items">
                        {cartItems.map((item) => (
                            <div
                                key={item.cartItemId || item.pid}
                                className="checkout-item"
                            >
                                <div className="checkout-item-image">
                                    <img
                                        src={item.image}
                                        alt={item.name || item.title}
                                    />
                                </div>
                                <div className="checkout-item-details">
                                    <h3>{item.name || item.title}</h3>
                                    {item.selectedOption && (
                                        <p className="checkout-item-option">
                                            Option: {item.selectedOption}
                                        </p>
                                    )}
                                    <p className="checkout-item-price">
                                        ${getProductPrice(item)} ×{" "}
                                        {item.quantity}
                                    </p>
                                    <p className="checkout-item-subtotal">
                                        $
                                        {(
                                            parseFloat(getProductPrice(item)) *
                                            item.quantity
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="checkout-totals">
                        <div className="checkout-subtotal">
                            <span>Subtotal:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="checkout-shipping">
                            <span>Shipping:</span>
                            <span>Free</span>
                        </div>
                        <div className="checkout-tax">
                            <span>Tax:</span>
                            <span>${(total * 0.08).toFixed(2)}</span>
                        </div>
                        <div className="checkout-total">
                            <span>Total:</span>
                            <span>${(total + total * 0.08).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="checkout-actions">
                        <button
                            className="back-button"
                            onClick={handleGoBack}
                            disabled={isSubmitting}
                        >
                            Back to Shop
                        </button>
                        <button
                            className="place-order-button"
                            onClick={handleSubmitOrder}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Processing..." : "Place Order"}
                        </button>
                    </div>
                </div>
            </div>

            {isSubmitting && (
                <div className="submitting-overlay">
                    <div className="submitting-message">
                        <div className="spinner"></div>
                        <h3>Submitting Your Order</h3>
                        <p>Please wait while we process your order...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
