// src/App.jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Checkout from './pages/Checkout'; // Jangan lupa import Checkout page
import 'flowbite/dist/flowbite.css';
import NavMenu from './components/NavMenu';
import Footer from './components/Footer';
import { CartProvider } from './components/common/CartContext'; // Import CartProvider
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Obat from './pages/Obat';
import SearchResults from './components/SearchResults';

const App = () => {
  return (
    <CartProvider> {/* Wrap application with CartProvider */}
      <div>
        <nav className='sticky top-0 z-50 bg-white shadow-md'>
          <NavMenu />
        </nav>
        <div className="container mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/checkout" element={<Checkout />} /> {/* Tambahkan ini */}
            <Route path="/Obat" element={<Obat/>} />
            <Route path="/search" element={<SearchResults />} />          
          </Routes>
          <ToastContainer />
        </div>
        <footer>
          <Footer />
        </footer>
      </div>
    </CartProvider>
  );
};

export default App;
