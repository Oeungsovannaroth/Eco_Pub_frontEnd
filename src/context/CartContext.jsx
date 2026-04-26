import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../services/api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);

  const loadCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCartItems([]);
      return;
    }

    try {
      setLoadingCart(true);
      const res = await apiFetch("/cart");
      setCartItems(res?.data?.items || []);
    } catch {
      setCartItems([]);
    } finally {
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const addToCart = async (product) => {
    await apiFetch("/cart/add", {
      method: "POST",
      body: JSON.stringify({
        menu_item_id: product._id || product.id,
        quantity: 1,
      }),
    });

    await loadCart();
  };

  const decreaseQty = async (cartItemId, currentQty) => {
    if (currentQty <= 1) {
      await removeFromCart(cartItemId);
      return;
    }

    await apiFetch(`/cart/items/${cartItemId}`, {
      method: "PATCH",
      body: JSON.stringify({
        quantity: currentQty - 1,
      }),
    });

    await loadCart();
  };

  const increaseQty = async (cartItemId, currentQty) => {
    await apiFetch(`/cart/items/${cartItemId}`, {
      method: "PATCH",
      body: JSON.stringify({
        quantity: currentQty + 1,
      }),
    });

    await loadCart();
  };

  const removeFromCart = async (cartItemId) => {
    await apiFetch(`/cart/items/${cartItemId}`, {
      method: "DELETE",
    });

    await loadCart();
  };

  const clearCart = async () => {
    await apiFetch("/cart/clear", {
      method: "DELETE",
    });
    setCartItems([]);
  };

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.subtotal || 0), 0),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
        loadCart,
        loadingCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}