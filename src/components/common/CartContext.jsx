import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Membuat context baru untuk keranjang belanja
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]); // State untuk menyimpan item dalam keranjang
    const [user, setUser] = useState(null); // State untuk menyimpan informasi pengguna saat ini

    // useEffect untuk memantau perubahan status autentikasi
    useEffect(() => {
        const auth = getAuth();
        // Fungsi ini akan dipanggil setiap kali status autentikasi berubah
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user); // Menyimpan informasi pengguna saat ini
                fetchCartItems(user.uid); // Mengambil item keranjang untuk pengguna saat ini
            } else {
                setUser(null); // Menghapus informasi pengguna saat logout
                setCartItems([]); // Mengosongkan keranjang belanja saat logout
            }
        });
    }, []);

    // useEffect untuk menyimpan item keranjang ke localStorage setiap kali item berubah
    useEffect(() => {
        if (user) {
            localStorage.setItem(`cartItems_${user.uid}`, JSON.stringify(cartItems)); // Menyimpan item keranjang ke localStorage
        }
    }, [cartItems, user]);

    // Fungsi untuk mengambil item keranjang dari Firebase
    const fetchCartItems = async (userId) => {
        try {
            const response = await axios.get(`https://simple-notes-firebase-8e9dd-default-rtdb.firebaseio.com/cart/${userId}.json?auth=lXYJqqYjWNufQN2OReTueq5MaI53zeEsIbXDh0zy`);
            if (response.data) {
                const items = Object.keys(response.data).map(key => ({
                    id: key,
                    ...response.data[key]
                }));
                setCartItems(items); // Menyimpan item keranjang ke state
            }
        } catch (error) {
            console.error('Error fetching cart items from Firebase:', error);
        }
    };

    // Fungsi untuk menambahkan item ke keranjang
    const addToCart = (item) => {
        setCartItems((prevItems) => [...prevItems, item]); // Menambahkan item baru ke state keranjang
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart }}>
            {children} {/* Menyediakan context ke komponen anak */}
        </CartContext.Provider>
    );
};
