import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'flowbite/dist/flowbite.css';
import { Modal } from 'flowbite';
import cart from '../assets/cart.png';
import Button from './common/Button';
import '../index.css';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Swal from 'sweetalert2';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';

const NavMenu = () => {
    const navigate = useNavigate(); // Hook untuk navigasi
    const [open, setOpen] = useState(false); // State untuk menampilkan dropdown
    const dropdownRef = useRef(null); // Referensi ke elemen dropdown
    const [modalContent, setModalContent] = useState(null); // State untuk konten modal
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State untuk status login
    const [searchTerm, setSearchTerm] = useState(''); // State untuk menyimpan term pencarian
    const [showResults, setShowResults] = useState(false); // State untuk menampilkan hasil pencarian

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user); // Set status login berdasarkan user
        });
        return () => unsubscribe(); // Bersihkan listener saat komponen unmount
    }, []);

    const handleClick = () => {
        setOpen(!open); // Toggle state untuk menampilkan dropdown
    };

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setOpen(false); // Tutup dropdown jika klik di luar elemen dropdown
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside); // Bersihkan listener saat komponen unmount
        };
    }, []);

    const handleClickModal = (content) => {
        setModalContent(content); // Set konten modal
        const modal = new Modal(document.getElementById('skill-modal'));
        modal.show(); // Tampilkan modal
    };

    const closeModal = () => {
        setModalContent(null); // Hapus konten modal
        const modal = new Modal(document.getElementById('skill-modal'));
        modal.hide(); // Sembunyikan modal
    };

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        Swal.fire({
            title: 'Login Berhasil',
            icon: 'success',
        }).then(closeModal); // Tampilkan notifikasi dan tutup modal setelah login berhasil
    };

    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                setIsLoggedIn(false);
                Swal.fire({
                    title: 'Logout Berhasil',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            })
            .catch((error) => {
                Swal.fire({
                    title: 'Logout Gagal',
                    text: error.message,
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            });
    };

    const handleCartClick = () => {
        navigate('/checkout'); // Navigasi ke halaman checkout
    };

    const handleHome = () => {
        navigate('/'); // Navigasi ke halaman home
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setShowResults(event.target.value.trim() !== ''); // Tampilkan hasil pencarian jika input tidak kosong
        if (event.target.value.trim()) {
            navigate(`/search?query=${event.target.value}`);
        }
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?query=${searchTerm}`); // Navigasi ke halaman pencarian dengan query
        } else {
            navigate('/search'); // Navigasi ke halaman pencarian tanpa query
        }
    };

    return (
        <div className='lg:w-auto'>
            <div className='grid grid-cols-3 m-4 py-3 lg:py-0 lg:pt-3'>
                <div>
                    <h2 onClick={handleHome} className='font-baloo text-[20px] lg:text-center lg:text-3xl'>Apotek</h2> {/* Navigasi ke home saat klik */}
                </div>
                <div className='justify-center items-center'>
                    <form onSubmit={handleSearchSubmit} className='relative justify-center items-center mx-auto w-max left-5'>
                        <input
                            placeholder='Cari Obat-obatan'
                            type="search"
                            value={searchTerm}
                            onChange={handleSearchChange} // Update term pencarian saat input berubah
                            className="peer cursor-pointer relative z-10 h-8 w-8 rounded-full border border-Button1 bg-transparent pr-5 outline-none focus:bg-white focus:w-[255px] focus:cursor-text focus:border-Button2 focus:pr-4 transition-all duration-300 ease-in-out focus:left-[-140px] lg:w-[350px] lg:h-10 focus:lg:w-[400px] focus:lg:transition-all focus:lg:left-0"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-y-0 -right-2 lg:relative lg:left-[280px] lg:-top-9 h-8 w-12 border-r border-transparent stroke-gray-500 px-3.5 peer-focus:border-lime-300 peer-focus:stroke-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </form>
                </div>
                <div className='flex justify-center gap-3 lg:gap-10 lg:w-full'>
                    <img
                        src={cart}
                        alt="keranjang"
                        className='w-6 h-6 lg:w-8 lg:h-8 lg:mt-0 mt-1'
                        onClick={handleCartClick} // Navigasi ke halaman checkout saat klik
                    />
                    <Button
                        id="dropdownDefaultButton"
                        name={isLoggedIn ? "Logout" : "Daftar"} // Tampilkan tombol Logout jika login, Daftar jika tidak
                        dropdown="dropdown"
                        onClick={isLoggedIn ? handleLogout : handleClick} // Toggle dropdown atau logout
                    />
                    {open && !isLoggedIn && (
                        <div ref={dropdownRef} className='absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-lg border border-gray-200 w-[100px] top-14 right-3 dark:bg-gray-700 mt-1 lg:w-[150px] lg:right-[120px]'>
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                <li>
                                    <button onClick={() => handleClickModal(<Login onLoginSuccess={handleLoginSuccess} closeModal={closeModal}/>)} className="block font-poppins w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Login</button> {/* Buka modal login */}
                                </li>
                                <li>
                                    <button onClick={() => handleClickModal(<Register />)} className="block font-poppins w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Register</button> {/* Buka modal register */}
                                </li>
                            </ul>
                        </div>
                    )}
                    {modalContent && (
                        <div id="skill-modal" data-modal-backdrop="static" tabIndex="-1" aria-hidden="true" className="fixed bg-black bg-opacity-50 items-center justify-center flex top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto h-modal md:h-full">
                            <div className="relative w-full h-full max-w-2xl md:h-auto lg:w-[500px]">
                                <div className="relative bg-white rounded-lg shadow">
                                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                        <button onClick={closeModal} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="skill-modal">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button> {/* Tombol untuk menutup modal */}
                                    </div>
                                    <div className="p-6">
                                        <p className="text-base mt-[-20px] leading-relaxed text-back font-poppins text-left dark:text-gray-400">
                                            {modalContent} {/* Tampilkan konten modal */}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NavMenu;
