import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiClient from "../apiClient";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null); // null = not fetched yet
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    // Fetch cart from backend. This runs once on provider mount.
    const fetchCart = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await apiClient.get("/cart");
            // If API returns { data: { ...cart } }
            setCart(res?.data?.data ?? { items: [], totalPrice: 0 });
        } catch (err) {
            // Keep cart as null so pages can attempt a retry when needed
            console.error("fetchCart error:", err);
            setCart({ items: [], totalPrice: 0 });
            toast.error("Unable to load cart (will retry on Cart page)");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Optimistic add/update quantity function
    const addToCart = async (productId, quantity) => {
        // update UI optimistically
        setCart((prev) => {
            if (!prev) return prev;
            const idx = prev.items.findIndex((it) => it.product._id === productId);
            let items = [...prev.items];

            if (idx > -1) {
                items[idx] = { ...items[idx], quantity: items[idx].quantity + quantity };
                if (items[idx].quantity <= 0) items.splice(idx, 1);
            } else {
                // In optimistic update we don't have full product data here.
                // Better approach is to rely on previous product object. If not available, skip optimistic add.
                // For safety, just return prev.
                return prev;
            }

            const totalPrice = items.reduce((s, it) => s + it.price * it.quantity, 0);
            return { ...prev, items, totalPrice };
        });

        try {
            await apiClient.post("/cart/add", { productId, quantity });
        } catch (err) {
            console.error("addToCart API error:", err);
            toast.error("Failed to update cart");
            // fallback: re-sync with server
            await fetchCart();
        }
    };

    // Optimistic remove
    const removeFromCart = async (productId) => {
        setCart((prev) => {
            if (!prev) return prev;
            const items = prev.items.filter((it) => it.product._id !== productId);
            const totalPrice = items.reduce((s, it) => s + it.price * it.quantity, 0);
            return { ...prev, items, totalPrice };
        });

        try {
            await apiClient.post("/cart/remove", { productId });
        } catch (err) {
            console.error("removeFromCart API error:", err);
            toast.error("Failed to remove item");
            await fetchCart();
        }
    };

    const updateQuantity = (productId, delta) => addToCart(productId, delta);

    return (
        <CartContext.Provider
            value={{
                cart,
                setCart,
                fetchCart,
                loading,
                addToCart,
                removeFromCart,
                updateQuantity,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
