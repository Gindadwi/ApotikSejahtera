import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

const midtransClientKey = 'SB-Mid-client-tN5lJrODMKqfbgfh';

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

    useEffect(() => {
        // Load Midtrans Snap script
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', midtransClientKey);
        document.body.appendChild(script);

        // Check if the script has loaded successfully
        script.onload = () => console.log('Midtrans Snap script loaded successfully');
        script.onerror = (error) => console.error('Error loading Midtrans Snap script:', error);

        return () => {
            document.body.removeChild(script);
        };
    }, []);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderDetails({ ...orderDetails, [name]: value });
    };

    const handlePlaceOrder = async () => {
        if (user) {
            try {
                const totalAmount = selectedItems.reduce((total, item) => total + parseFloat(item.price), 0);
                const order = {
                    user: {
                        uid: user.uid,
                        email: user.email,
                    },
                    orderDetails,
                    totalAmount,
                };

                const token = await user.getIdToken();

                const response = await axios.post(
                    'https://simple-notes-firebase-8e9dd.cloudfunctions.net/createTransaction',
                    order,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const snapToken = response.data.transaction.token;

                window.snap.pay(snapToken, {
                    onSuccess: async function (result) {
                        alert('Pembayaran berhasil!');
                        await axios.post(
                            'https://simple-notes-firebase-8e9dd-default-rtdb.firebaseio.com/orders.json?auth=' + token,
                            {
                                ...order,
                                transactionStatus: 'completed',
                                midtransTransactionId: result.transaction_id,
                                timestamp: new Date().toISOString(),
                            }
                        );
                        setOrderDetails({
                            nama: '',
                            nomor: '',
                            alamat: '',
                            paymentMethod: 'gopay',
                        });
                    },
                    onPending: function () {
                        alert('Pembayaran dalam proses');
                    },
                    onError: function () {
                        alert('Pembayaran gagal');
                    },
                    onClose: function () {
                        alert('Anda menutup jendela pembayaran');
                    }
                });
            } catch (error) {
                console.error('Error placing order:', error);
                alert('Terjadi kesalahan dalam proses transaksi');
            }
        } else {
            alert('Anda harus login terlebih dahulu untuk melakukan pembayaran.');
        }
    };

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
                        <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
                    </div>
                    <div className='mt-2 text-black lg:text-right font-poppins '>
                        <span>{totalAmount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
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
        </div>
    );
};

export default CheckoutPage;
