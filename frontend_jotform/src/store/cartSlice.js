import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [], // array of items in the cart
    total: 0, // total price of the cart
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            // Her zaman yeni bir item olarak ekliyoruz, var olan miktarını artırmak yerine
            // Her ürün için benzersiz bir id oluştur (timestamp kullanarak)
            const uniqueId = new Date().getTime();

            // Store all product details in the cart
            state.items.push({
                ...action.payload, // Include all product properties
                cartItemId: uniqueId, // Her cart item için benzersiz ID
                quantity: action.payload.quantity || 1, // Use provided quantity or default to 1
            });

            // final price calculation
            state.total = state.items.reduce((sum, item) => {
                const itemPrice = item.finalPrice || item.price;
                return sum + parseFloat(itemPrice) * item.quantity;
            }, 0);

            // debug log
            console.log("Cart updated after ADD:", {
                newItem: {
                    cartItemId: uniqueId,
                    pid: action.payload.pid,
                    name: action.payload.name || action.payload.title,
                    price: action.payload.price,
                    finalPrice: action.payload.finalPrice,
                    quantity: action.payload.quantity || 1,
                },
                itemsCount: state.items.length,
                total: state.total.toFixed(2),
                allItems: state.items.map((item) => ({
                    cartItemId: item.cartItemId,
                    pid: item.pid,
                    name: item.name || item.title,
                    price: item.price,
                    finalPrice: item.finalPrice,
                    quantity: item.quantity,
                })),
            });
        },
        removeFromCart: (state, action) => {
            // cartItemId ile item kaldırma
            state.items = state.items.filter(
                (item) =>
                    item.cartItemId !== action.payload &&
                    item.pid !== action.payload
            );

            // Total hesaplamasını finalPrice veya price değeri kullanarak güncelle
            state.total = state.items.reduce((sum, item) => {
                const itemPrice = item.finalPrice || item.price;
                return sum + parseFloat(itemPrice) * item.quantity;
            }, 0);

            // debug log
            console.log("Cart updated after REMOVE:", {
                removedId: action.payload,
                itemsCount: state.items.length,
                total: state.total.toFixed(2),
                allItems: state.items.map((item) => ({
                    cartItemId: item.cartItemId,
                    pid: item.pid,
                    name: item.name || item.title,
                    price: item.price,
                    finalPrice: item.finalPrice,
                    quantity: item.quantity,
                })),
            });
        },
        updateQuantity: (state, action) => {
            const { pid, cartItemId, quantity } = action.payload;
            let item;

            // Önce cartItemId ile bulmaya çalış
            if (cartItemId) {
                item = state.items.find(
                    (item) => item.cartItemId === cartItemId
                );
            }

            // Eğer cartItemId ile bulunamazsa pid ile dene
            if (!item && pid) {
                item = state.items.find((item) => item.pid === pid);
            }

            if (item) {
                item.quantity = quantity;

                // Total hesaplamasını finalPrice veya price değeri kullanarak güncelle
                state.total = state.items.reduce((sum, item) => {
                    const itemPrice = item.finalPrice || item.price;
                    return sum + parseFloat(itemPrice) * item.quantity;
                }, 0);

                // debug log
                console.log("Cart updated after QUANTITY UPDATE:", {
                    updatedItem: {
                        cartItemId: item.cartItemId,
                        pid: item.pid,
                        name: item.name || item.title,
                        oldQuantity:
                            item.quantity !== quantity ? quantity : "unchanged",
                        newQuantity: item.quantity,
                        price: item.price,
                        finalPrice: item.finalPrice,
                    },
                    itemsCount: state.items.length,
                    total: state.total.toFixed(2),
                    allItems: state.items.map((item) => ({
                        cartItemId: item.cartItemId,
                        pid: item.pid,
                        name: item.name || item.title,
                        price: item.price,
                        finalPrice: item.finalPrice,
                        quantity: item.quantity,
                    })),
                });
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;

            // debug log
            console.log("Cart CLEARED completely", {
                previousItemsCount:
                    state.items.length > 0 ? state.items.length : 0,
                previousTotal:
                    state.total > 0 ? state.total.toFixed(2) : "0.00",
                newState: { items: [], total: 0 },
            });
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
    cartSlice.actions;
export default cartSlice.reducer;
