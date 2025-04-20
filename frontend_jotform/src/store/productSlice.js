import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [], // Tüm ürün listesi
    isLoaded: false, // Ürünlerin yüklenip yüklenmediği
};

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
            state.isLoaded = true;
        },
        resetProducts: (state) => {
            state.products = [];
            state.isLoaded = false;
        },
    },
});

export const { setProducts, resetProducts } = productSlice.actions;
export default productSlice.reducer;
