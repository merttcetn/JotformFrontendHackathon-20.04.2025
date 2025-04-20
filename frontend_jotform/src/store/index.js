import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import productReducer from "./productSlice";

export const store = configureStore({
    reducer: {
        cart: cartReducer, // cart reducer
        products: productReducer, // product reducer
    },
    // Redux DevTools için ayarlar
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Timestamp gibi serialize edilemeyen değerler için
        }),
});
