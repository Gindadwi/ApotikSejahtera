import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

// Fungsi untuk mengonversi angka menjadi teks dalam bahasa Indonesia
const numberToWords = (number) => {
    const units = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
    const teens = ['sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas'];
    const tens = ['', '', 'dua puluh', 'tiga puluh', 'empat puluh', 'lima puluh', 'enam puluh', 'tujuh puluh', 'delapan puluh', 'sembilan puluh'];
    const thousands = ['', 'ribu', 'juta', 'miliar', 'triliun'];

    // Jika angka yang diterima adalah 0, kembalikan teks 'nol rupiah'
    if (number === 0) return 'nol rupiah';

    let word = '';
    let i = 0;

    // Looping untuk memecah angka menjadi kelompok ribuan dan mengonversinya ke teks
    while (number > 0) {
        let remainder = number % 1000;

        if (remainder > 0) {
            let str = '';
            if (remainder % 100 < 20 && remainder % 100 >= 10) {
                str = teens[remainder % 10] + ' ';
            } else {
                if (remainder % 10 > 0) str = units[remainder % 10] + ' ';
                if (Math.floor(remainder / 10) % 10 > 1) str = tens[Math.floor(remainder / 10) % 10] + ' ' + str;
            }

            if (Math.floor(remainder / 100) > 0) {
                if (Math.floor(remainder / 100) === 1) {
                    str = 'seratus ' + str;
                } else {
                    str = units[Math.floor(remainder / 100)] + ' ratus ' + str;
                }
            }

            word = str + thousands[i] + ' ' + word;
        }

        number = Math.floor(number / 1000);
        i++;
    }

    return word.trim() + ' rupiah';
};

// Fungsi untuk memformat angka dengan titik setiap tiga digit
const formatNumber = (number) => {
    return number.toLocaleString('id-ID');
};

// Contoh penggunaan fungsi formatNumber dan numberToWords
const totalAmount = 120000;
console.log(formatNumber(totalAmount)); // Output: 120.000
console.log(numberToWords(totalAmount)); // Output: seratus dua puluh ribu rupiah

// Komponen utama halaman checkout
const CheckoutPage = () => {
    // Mengambil data yang dikirim melalui state menggunakan useLocation dari react-router-dom
    const location = useLocation();
    const selectedItems = location.state?.selectedItems || []; // Produk yang dipilih pengguna
    const auth = getAuth();
    const user = auth.currentUser; // Mendapatkan pengguna yang sedang login
    const [orderDetails, setOrderDetails] = useState({
        nama: '',
        nomor: '',
        alamat: '',
        paymentMethod: 'credit_card',
    });

    // Fungsi untuk menangani perubahan input pada form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderDetails({ ...orderDetails, [name]: value });
    };

    // Fungsi untuk menangani saat pengguna menekan tombol "Order Sekarang"
    const handlePlaceOrder = async () => {
        if (user) {
            try {
                const idToken = await user.getIdToken(true); // Mendapatkan token autentikasi pengguna
                const order = {
                    userId: user.uid, // ID pengguna yang melakukan order
                    items: selectedItems, // Produk yang dipesan
                    orderDetails, // Detail pengiriman
                    timestamp: new Date().toISOString(), // Waktu order
                };
                // Mengirim data order ke Firebase Realtime Database
                await axios.post(`https://simple-notes-firebase-8e9dd-default-rtdb.firebaseio.com/orders.json?auth=lXYJqqYjWNufQN2OReTueq5MaI53zeEsIbXDh0zy`, order);
                alert('Order placed successfully!'); // Menampilkan pesan sukses
                setOrderDetails({
                    nama: '',
                    nomor: '',
                    alamat: '',
                    paymentMethod: 'credit_card',
                });
            } catch (error) {
                console.error('Error placing order:', error);
            }
        }
    };

    // Menghitung total harga dari semua produk yang dipilih
    const totalAmount = selectedItems.reduce((total, item) => total + parseFloat(item.price), 0);

    return (
        <div className='container mx-auto p-5'>
            <h1 className='text-center font-baloo text-[24px] lg:text-[36px] mb-5'>Checkout</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div className='bg-white border rounded-lg shadow-lg p-5'>
                    <h2 className='font-semibold font-poppins text-lg mb-4'>Pesanan Kamu</h2>
                    <ul>
                        {selectedItems.map((item, index) => (
                            <li key={item.firebaseId || index} className="flex justify-between border-b py-2">
                                <span>{item.name}</span>
                                <span>Rp {item.price}</span>
                            </li>
                        ))}
                    </ul>
                    <div className='flex justify-between mt-4 font-bold'>
                        <span>Total</span>
                        <span>Rp {formatNumber(totalAmount)}</span>
                    </div>
                    <div className='mt-2 text-black lg:text-right font-poppins '>
                        <span>{numberToWords(totalAmount)}</span>
                    </div>
                </div>
                <div className='bg-white border rounded-lg shadow-lg p-5'>
                    <h2 className='font-semibold font-poppins text-lg mb-4'>Detail Pengiriman</h2>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Nama Lengkap</label>
                        <input
                            type='text'
                            name='nama'
                            value={orderDetails.nama}
                            onChange={handleInputChange}
                            className='w-full px-4 py-2 border rounded-lg'
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Nomor Telepon</label>
                        <input
                            type='number'
                            name='nomor'
                            value={orderDetails.nomor}
                            onChange={handleInputChange}
                            className='w-full px-4 py-2 border rounded-lg'
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Alamat Lengkap</label>
                        <input
                            type='text'
                            name='alamat'
                            value={orderDetails.alamat}
                            onChange={handleInputChange}
                            className='w-full px-4 py-2 border rounded-lg'
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Metode Pembayaran</label>
                        <select
                            name='paymentMethod'
                            value={orderDetails.paymentMethod}
                            onChange={handleInputChange}
                            className='w-full px-4 py-2 border rounded-lg'
                        >
                            <option value='credit_card'>Kartu Kredit</option>
                            <option value='paypal'>PayPal</option>
                            <option value='bank_transfer'>Transfer Bank</option>
                        </select>
                    </div>
                    <button
                        onClick={handlePlaceOrder}
                        className='w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 font-poppins'
                    >
                        Order Sekarang
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
