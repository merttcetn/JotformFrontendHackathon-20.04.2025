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
            const existingItem = state.items.find(
                (item) => item.pid === action.payload.pid
            );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                // Store all product details in the cart
                state.items.push({
                    ...action.payload, // Include all product properties
                    quantity: 1,
                });
            }

            state.total = state.items.reduce(
                (sum, item) => sum + parseFloat(item.price) * item.quantity,
                0
            );

            // debug log
            console.log("Cart updated:", {
                items: state.items,
                total: state.total,
            });
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(
                (item) => item.pid !== action.payload
            );
            state.total = state.items.reduce(
                (sum, item) => sum + parseFloat(item.price) * item.quantity,
                0
            );

            // debug log
            console.log("Cart updated:", {
                items: state.items,
                total: state.total,
            });
        },
        updateQuantity: (state, action) => {
            const { pid, quantity } = action.payload;
            const item = state.items.find((item) => item.pid === pid);
            if (item) {
                item.quantity = quantity;
                state.total = state.items.reduce(
                    (sum, item) => sum + parseFloat(item.price) * item.quantity,
                    0
                );

                // debug log
                console.log("Cart updated:", {
                    items: state.items,
                    total: state.total,
                });
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;

            // debug log
            console.log("Cart cleared");
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
    cartSlice.actions;
export default cartSlice.reducer;
