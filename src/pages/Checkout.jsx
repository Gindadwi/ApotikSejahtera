import React, { useContext, useEffect, useState } from 'react'; // Mengimpor React dan hook yang dibutuhkan
import { CartContext } from '../components/common/CartContext.jsx'; // Mengimpor CartContext untuk mengakses konteks keranjang
import { getAuth } from 'firebase/auth'; // Mengimpor fungsi otentikasi Firebase
import axios from 'axios'; // Mengimpor Axios untuk melakukan permintaan HTTP

const Checkout = () => {
    const { cartItems, setCartItems } = useContext(CartContext); // Mengakses item keranjang dan fungsi untuk mengubahnya dari CartContext
    const [cart, setCart] = useState([]); // Mengatur state untuk menyimpan item keranjang
    const auth = getAuth(); // Mendapatkan instance otentikasi Firebase
    const user = auth.currentUser; // Mendapatkan pengguna yang sedang masuk

    // useEffect untuk mengambil data keranjang dari Firebase saat komponen dimuat
    useEffect(() => {
        const fetchCartItems = async () => {
            if (user) { // Jika pengguna ada (sudah masuk)
                try {
                    const idToken = await user.getIdToken(true); // Mendapatkan ID token untuk otorisasi
                    const response = await axios.get(`https://simple-notes-firebase-8e9dd-default-rtdb.firebaseio.com/cart/${user.uid}.json?auth=lXYJqqYjWNufQN2OReTueq5MaI53zeEsIbXDh0zy`); // Melakukan permintaan GET untuk mendapatkan item keranjang
                    if (response.data) { // Jika ada data yang diterima
                        const fetchedCartItems = Object.keys(response.data).map(key => ({
                            firebaseId: key,
                            ...response.data[key]
                        })); // Memetakan data yang diterima ke dalam array item keranjang
                        setCart(fetchedCartItems); // Mengatur state keranjang dengan data yang diterima
                    }
                } catch (error) {
                    console.error('Error fetching cart items:', error); // Menangani kesalahan jika terjadi
                }
            }
        };
        fetchCartItems(); // Memanggil fungsi untuk mengambil data keranjang
    }, [user]); // useEffect akan dipanggil ulang jika user berubah

    // Fungsi untuk menghapus item dari keranjang
    const handleClickDelete = async (firebaseId) => {
        if (user) { // Jika pengguna ada (sudah masuk)
            try {
                const idToken = await user.getIdToken(true); // Mendapatkan ID token untuk otorisasi
                await axios.delete(`https://simple-notes-firebase-8e9dd-default-rtdb.firebaseio.com/cart/${user.uid}/${firebaseId}.json?auth=lXYJqqYjWNufQN2OReTueq5MaI53zeEsIbXDh0zy`); // Melakukan permintaan DELETE untuk menghapus item
                const updatedItems = cart.filter(item => item.firebaseId !== firebaseId); // Menghapus item dari state keranjang
                setCart(updatedItems); // Mengatur state keranjang dengan item yang diperbarui
                console.log("Item berhasil dihapus dari Firebase dan UI");
            } catch (error) {
                console.error("Tidak bisa menghapus item dari Firebase:", error); // Menangani kesalahan jika terjadi
            }
        }
    };

    if (!user) {
        return <p>Anda harus login untuk melihat data checkout.</p>; // Jika pengguna belum masuk, tampilkan pesan
    }

    return (
        <div className='container mx-auto'>
            <h1 className='text-center font-baloo text-[24px]'>Keranjang Obat</h1>
            <ul className='mt-5 container mx-auto lg:max-w-[720px] lg:w-full lg:grid lg:grid-cols-2'>
                {cart.map(item => ( // Iterasi melalui item keranjang dan menampilkannya
                    <li key={item.firebaseId}>
                        <div className="justify-between items-center p-4 border-b shadow-md border border-gray-200 m-1 rounded-lg lg:max-w-[720px]">
                            <div className='bg-gray-200 items-center justify-center p-4 rounded-lg'>
                                <div className='flex lg:block lg:h-[230px]'>
                                    <img src={item.image} alt={item.name} className="w-[200px] h-[100px] rounded object-cover" /> {/* Menampilkan gambar item */}
                                    <div className="ml-4 lg:mt-3">
                                        <h2 className='font-semibold font-poppins'>{item.name}</h2> {/* Menampilkan nama item */}
                                        <p className='font-poppins text-[13px] lg:text-[18px]'>{item.use}</p> {/* Menampilkan kegunaan item */}
                                    </div>
                                </div>
                                <div>
                                    <p className='font-semibold text-red-700 font-poppins text-right lg:text-[18px]'>{item.price}</p> {/* Menampilkan harga item */}
                                </div>
                            </div>
                            <div className='w-full flex justify-end'>
                                <button onClick={() => handleClickDelete(item.firebaseId)} className='w-[150px] h-[35px] rounded-md bg-red-900 text-white font-poppins mt-5'>delete</button> {/* Tombol untuk menghapus item */}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Checkout;
