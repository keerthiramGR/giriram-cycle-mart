"use client";

import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }) {
    return (
        <AuthProvider>
            <CartProvider>
                <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
                {children}
            </CartProvider>
        </AuthProvider>
    );
}
