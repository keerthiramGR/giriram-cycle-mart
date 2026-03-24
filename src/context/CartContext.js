"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [shippingOption, setShippingOption] = useState('standard');
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('gcm_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error("Could not parse cart", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever cart changes (after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('gcm_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.id === product.id);
      if (existingIdx >= 0) {
        return prev.map((item, i) => 
          i === existingIdx ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { 
        id: product.id,
        name: product.name,
        brand: product.brand || '',
        price: product.price,
        primary_image_url: product.images ? product.images[0] : (product.primary_image_url || ''),
        quantity 
      }];
    });
  };

  const buyNow = (product, quantity = 1) => {
    setCart([{ 
      id: product.id,
      name: product.name,
      brand: product.brand || '',
      price: product.price,
      primary_image_url: product.images ? product.images[0] : (product.primary_image_url || ''),
      quantity 
    }]);
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      cartTotal,
      cartCount,
      shippingOption,
      setShippingOption,
      addToCart,
      buyNow,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
