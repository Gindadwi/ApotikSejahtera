import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const CheckoutPage = () => {
    const location = useLocation();
    const selectedItems = location.state?.selectedItems || [];
    const auth = getAuth();
    const user = auth.currentUser;
    const storage = getStorage();

    const [orderDetails, setOrderDetails] = useState({
        nama: '',
        nomor: '',
        alamat: '',
        paymentMethod: '',
        proofOfPayment: null,
    });

    const banks = [
        { name: 'Bank BCA', accountNumber: '1234567890' },
        { name: 'Bank BRI', accountNumber: '0987654321' },
        { name: 'Bank Mandiri', accountNumber: '1122334455' },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderDetails({ ...orderDetails, [name]: value });
    };

    const handleFileChange = (e) => {
        setOrderDetails({ ...orderDetails, proofOfPayment: e.target.files[0] });
    };

    const uploadProofOfPayment = async (file, user) => {
        if (!user) {
            throw new Error('User must be logged in to upload files');
        }

        const storageRef = ref(storage, `payments/${user.uid}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Add progress bar if needed
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const handlePlaceOrder = async () => {
        if (user) {
            try {
                const proofOfPaymentUrl = await uploadProofOfPayment(orderDetails.proofOfPayment, user);

                const totalAmount = selectedItems.reduce((total, item) => total + parseFloat(item.price), 0);
                const order = {
                    user: {
                        uid: user.uid,
                        email: user.email,
                    },
                    orderDetails: { ...orderDetails, proofOfPaymentUrl },
                    totalAmount,
                    transactionStatus: 'pending', // Set initial status as pending
                };

                const token = await user.getIdToken(true);

                await axios.post(
                    `https://simple-notes-firebase-8e9dd-default-rtdb.firebaseio.com/orders.json?auth=${token}`,
                    {
                        ...order,
                        timestamp: new Date().toISOString(),
                    }
                );

                alert('Pesanan berhasil dibuat.');

                setOrderDetails({
                    nama: '',
                    nomor: '',
                    alamat: '',
                    paymentMethod: '',
                    proofOfPayment: null,
                });
            } catch (error) {
                console.error('Error placing order:', error);
                alert('Terjadi kesalahan dalam memproses pesanan');
            }
        } else {
            alert('Anda harus login terlebih dahulu untuk melakukan pemesanan.');
        }
    };

    const totalAmount = selectedItems.reduce((total, item) => total + parseFloat(item.price), 0);

    const handleCopyAccountNumber = (accountNumber) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(accountNumber)
                .then(() => {
                    alert('Nomor rekening berhasil disalin!');
                })
                .catch((err) => {
                    console.error('Gagal menyalin teks: ', err);
                    alert('Gagal menyalin teks.');
                });
        } else {
            // Fallback for browsers without clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = accountNumber;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                alert('Nomor rekening berhasil disalin!');
            } catch (err) {
                console.error('Gagal menyalin teks: ', err);
                alert('Gagal menyalin teks.');
            }
            document.body.removeChild(textArea);
        }
    };

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
                    <div className='mt-2 text-black lg:text-right font-poppins'>
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
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Pilih Bank</label>
                        {banks.map((bank, index) => (
                            <div key={index} className="mb-2">
                                <button
                                    type="button"
                                    className={`w-full py-2 bg-gray-200 text-left px-4 rounded-lg transition-all duration-300 ${orderDetails.paymentMethod === bank.name ? 'bg-gray-300' : ''}`}
                                    onClick={() => setOrderDetails({ ...orderDetails, paymentMethod: bank.name })}
                                >
                                    {bank.name}
                                </button>
                                {orderDetails.paymentMethod === bank.name && (
                                    <div className="mt-2 px-4 py-2 bg-gray-100 rounded-lg flex justify-between items-center">
                                        <p className="mr-2">Nomor Rekening: {bank.accountNumber}</p>
                                        <button
                                            type="button"
                                            className="text-blue-500"
                                            onClick={() => handleCopyAccountNumber(bank.accountNumber)}
                                        >
                                            Salin
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Unggah Bukti Pembayaran</label>
                        <input
                            type='file'
                            accept='image/*'
                            onChange={handleFileChange}
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
