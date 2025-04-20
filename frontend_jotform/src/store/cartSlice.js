import { createSlice } from "@reduxjs/toolkit";

// localStorage'dan sepet verilerini al
const loadCartFromLocalStorage = () => {
    try {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            return JSON.parse(storedCart);
        }
    } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
    }
    return {
        items: [],
        total: 0,
        selectedProductsList: {},
    };
};

// localStorage'a sepet verilerini kaydet
const saveCartToLocalStorage = (cart) => {
    try {
        localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
    }
};

const initialState = loadCartFromLocalStorage();

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            // Her zaman yeni bir item olarak ekliyoruz, var olan miktarını artırmak yerine
            // Her ürün için benzersiz bir id oluştur (timestamp kullanarak)
            const uniqueId = new Date().getTime();
            const product = action.payload;

            // Store all product details in the cart
            state.items.push({
                ...product, // Include all product properties
                cartItemId: uniqueId, // Her cart item için benzersiz ID
                quantity: product.quantity || 1, // Use provided quantity or default to 1
            });

            // JotForm formatına uygun veri yapısını güncelleyelim
            updateSelectedProductsList(state);

            // final price calculation
            state.total = state.items.reduce((sum, item) => {
                const itemPrice = item.finalPrice || item.price;
                return sum + parseFloat(itemPrice) * item.quantity;
            }, 0);

            // localStorage'a kaydet
            saveCartToLocalStorage({
                items: state.items,
                total: state.total,
                selectedProductsList: state.selectedProductsList,
            });

            // debug log
            console.log("Cart updated after ADD:", {
                newItem: {
                    cartItemId: uniqueId,
                    pid: product.pid,
                    name: product.name || product.title,
                    price: product.price,
                    finalPrice: product.finalPrice,
                    quantity: product.quantity || 1,
                },
                itemsCount: state.items.length,
                total: state.total.toFixed(2),
                selectedProductsList: state.selectedProductsList,
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

            // JotForm formatına uygun veri yapısını güncelleyelim
            updateSelectedProductsList(state);

            // Total hesaplamasını finalPrice veya price değeri kullanarak güncelle
            state.total = state.items.reduce((sum, item) => {
                const itemPrice = item.finalPrice || item.price;
                return sum + parseFloat(itemPrice) * item.quantity;
            }, 0);

            // localStorage'a kaydet
            saveCartToLocalStorage({
                items: state.items,
                total: state.total,
                selectedProductsList: state.selectedProductsList,
            });

            // debug log
            console.log("Cart updated after REMOVE:", {
                removedId: action.payload,
                itemsCount: state.items.length,
                total: state.total.toFixed(2),
                selectedProductsList: state.selectedProductsList,
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

                // JotForm formatına uygun veri yapısını güncelleyelim
                updateSelectedProductsList(state);

                // Total hesaplamasını finalPrice veya price değeri kullanarak güncelle
                state.total = state.items.reduce((sum, item) => {
                    const itemPrice = item.finalPrice || item.price;
                    return sum + parseFloat(itemPrice) * item.quantity;
                }, 0);

                // localStorage'a kaydet
                saveCartToLocalStorage({
                    items: state.items,
                    total: state.total,
                    selectedProductsList: state.selectedProductsList,
                });

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
                    selectedProductsList: state.selectedProductsList,
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
            state.selectedProductsList = {};

            // localStorage'dan sepeti temizle
            localStorage.removeItem("cart");

            // debug log
            console.log("Cart CLEARED completely", {
                previousItemsCount:
                    state.items.length > 0 ? state.items.length : 0,
                previousTotal:
                    state.total > 0 ? state.total.toFixed(2) : "0.00",
                newState: { items: [], total: 0, selectedProductsList: {} },
            });
        },
    },
});

// JotForm formatına uygun ürün listesi oluşturan yardımcı fonksiyon
const updateSelectedProductsList = (state) => {
    const selectedProductsList = {};

    // Ürünleri pid'ye göre gruplandır
    state.items.forEach((item) => {
        const pid = item.pid;

        // Eğer bu product id ile bir grup oluşturulmamışsa oluştur
        if (!selectedProductsList[pid]) {
            selectedProductsList[pid] = [];
        }

        // Ürün seçeneklerini belirle
        const sizeOption = item.selectedOption || "Default Size";

        // JotForm formatına uygun yapıda bilgileri ekle
        selectedProductsList[pid].push({
            customOptionValues: {
                0: item.quantity.toString(), // Miktar
                1: sizeOption, // Ürün boyutu/seçeneği
            },
            quantity: item.quantity.toString(),
        });
    });

    state.selectedProductsList = selectedProductsList;
};

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
    cartSlice.actions;
export default cartSlice.reducer;
