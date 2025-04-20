import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    total: 0,
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
                state.items.push({ ...action.payload, quantity: 1 });
            }

            state.total = state.items.reduce(
                (sum, item) => sum + parseFloat(item.price) * item.quantity,
                0
            );
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(
                (item) => item.pid !== action.payload
            );
            state.total = state.items.reduce(
                (sum, item) => sum + parseFloat(item.price) * item.quantity,
                0
            );
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
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
    cartSlice.actions;
export default cartSlice.reducer;
