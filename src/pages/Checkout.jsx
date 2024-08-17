import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

// Memuat script Midtrans snap
const snapSrc = 'https://app.sandbox.midtrans.com/snap/snap.js'; // URL script Midtrans
const midtransClientKey = 'SB-Mid-client-tN5lJrODMKqfbgfh'; // Ganti dengan client key Anda

// Fungsi untuk mengonversi angka menjadi teks dalam bahasa Indonesia
const numberToWords = (number) => {
    const units = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
    const teens = ['sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas'];
    const tens = ['', '', 'dua puluh', 'tiga puluh', 'empat puluh', 'lima puluh', 'enam puluh', 'tujuh puluh', 'delapan puluh', 'sembilan puluh'];
    const thousands = ['', 'ribu', 'juta', 'miliar', 'triliun'];

    if (number === 0) return 'nol rupiah';

    let word = '';
    let i = 0;

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

const CheckoutPage = () => {
    const location = useLocation();
    const selectedItems = location.state?.selectedItems || [];
    const auth = getAuth();
    const user = auth.currentUser;
    const [orderDetails, setOrderDetails] = useState({
        nama: '',
        nomor: '',
        alamat: '',
        paymentMethod: 'gopay', // Metode pembayaran default
    });

    // Fungsi untuk menangani perubahan input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderDetails({ ...orderDetails, [name]: value });
    };

    // Fungsi untuk memproses pesanan
    const handlePlaceOrder = async () => {
        if (user) {
            try {
                const order = {
                    user: {
                        uid: user.uid,
                        email: user.email
                    },
                    orderDetails,
                    totalAmount: totalAmount,
                };

                // Mendapatkan token dari Firebase Auth
                const token = await user.getIdToken();

                // Mengirim permintaan transaksi ke Firebase Cloud Function
                const response = await axios.post(
                    'https://simple-notes-firebase-8e9dd.cloudfunctions.net/createTransaction.json?auth=lXYJqqYjWNufQN2OReTueq5MaI53zeEsIbXDh0zy',
                    order,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const { snapToken } = response.data;

                // Menjalankan pembayaran menggunakan snapToken
                window.snap.pay(snapToken, {
                    onSuccess: async function (result) {
                        alert('Pembayaran berhasil!');

                        // Menyimpan data pesanan ke Firebase Realtime Database
                        await axios.post(
                            'https://simple-notes-firebase-8e9dd-default-rtdb.firebaseio.com/orders.json?auth=lXYJqqYjWNufQN2OReTueq5MaI53zeEsIbXDh0zy', // Ganti dengan URL database Anda
                            {
                                ...order,
                                transactionStatus: 'completed',
                                midtransTransactionId: result.transaction_id,
                                timestamp: new Date().toISOString(),
                            }
                        );

                        // Mengatur ulang detail pesanan
                        setOrderDetails({
                            nama: '',
                            nomor: '',
                            alamat: '',
                            paymentMethod: 'credit_card',
                        });
                    },
                    onPending: function (result) {
                        alert('Pembayaran dalam proses');
                    },
                    onError: function (result) {
                        alert('Pembayaran gagal');
                    },
                    onClose: function () {
                        alert('Anda menutup jendela pembayaran');
                    }
                });
            } catch (error) {
                console.error('Error placing order:', error.response || error.message || error);
                alert('Terjadi kesalahan dalam proses transaksi');
            }
        }
    };

    // Menghitung total jumlah harga dari item yang dipilih
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
                    <button
                        onClick={handlePlaceOrder}
                        className='w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 font-poppins'
                    >
                        Order Sekarang
                    </button>
                </div>
            </div>

            {/* Menyertakan script Midtrans Snap */}
            <script src={snapSrc} data-client-key={midtransClientKey}></script>
        </div>
    );
};

export default CheckoutPage;
