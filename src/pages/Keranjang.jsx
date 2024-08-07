import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../components/common/CartContext.jsx';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const { cartItems, setCartItems } = useContext(CartContext);
    const [cart, setCart] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]); // State untuk item yang dipilih
    const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            if (user) {
                try {
                    const idToken = await user.getIdToken(true);
                    const response = await axios.get(`https://simple-notes-firebase-8e9dd-default-rtdb.firebaseio.com/cart/${user.uid}.json?auth=lXYJqqYjWNufQN2OReTueq5MaI53zeEsIbXDh0zy`);
                    if (response.data) {
                        const fetchedCartItems = Object.keys(response.data).map(key => ({
                            firebaseId: key,
                            ...response.data[key]
                        }));
                        setCart(fetchedCartItems);
                    }
                } catch (error) {
                    console.error('Error fetching cart items:', error);
                }
            }
        };
        fetchCartItems();
    }, [user]);

    const handleClickDelete = async (firebaseId) => {
        if (user) {
            try {
                const idToken = await user.getIdToken(true);
                await axios.delete(`https://simple-notes-firebase-8e9dd-default-rtdb.firebaseio.com/cart/${user.uid}/${firebaseId}.json?auth=lXYJqqYjWNufQN2OReTueq5MaI53zeEsIbXDh0zy`);
                const updatedItems = cart.filter(item => item.firebaseId !== firebaseId);
                setCart(updatedItems);
                console.log("Item berhasil dihapus dari Firebase dan UI");
            } catch (error) {
                console.error("Tidak bisa menghapus item dari Firebase:", error);
            }
        }
    };

    const handleSelectItem = (item) => {
        setSelectedItems(prevSelectedItems => {
            if (prevSelectedItems.includes(item)) {
                return prevSelectedItems.filter(selectedItem => selectedItem !== item);
            } else {
                return [...prevSelectedItems, item];
            }
        });
    };

    const handleCheckout = () => {
        if (selectedItems.length > 0) {
            navigate('/CheckoutPage', { state: { selectedItems } }); // Navigasi ke halaman checkout dengan item yang dipilih
        } else {
            alert('Pilih item yang ingin Anda checkout.');
        }
    };

    if (!user) {
        return <p className="text-center mt-10">Anda harus login untuk melihat data checkout.</p>;
    }

    return (
        <div className='container mx-auto p-5'>
            <h1 className='text-center font-baloo text-[24px] lg:text-[36px] mb-5'>Keranjang Obat</h1>
            <ul className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
                {cart.map(item => (
                    <li key={item.firebaseId} className="bg-white border rounded-lg shadow-lg overflow-hidden">
                        <div className="flex flex-col h-full">
                            <div className="bg-gray-200 p-4 flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-lg" />
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <h2 className='font-semibold font-poppins text-lg'>{item.name}</h2>
                                <p className='font-poppins text-sm lg:text-base mt-2'>{item.use}</p>
                                <p className='font-semibold text-red-700 font-poppins mt-auto text-right lg:text-lg'>{item.price}</p>
                                <div className='mt-4'>
                                    <label className='inline-flex items-center'>
                                        <input
                                            type='checkbox'
                                            checked={selectedItems.includes(item)}
                                            onChange={() => handleSelectItem(item)}
                                            className='form-checkbox'
                                        />
                                        <span className='ml-2'>Pilih untuk checkout</span>
                                    </label>
                                </div>
                            </div>
                            <div className='p-4 bg-gray-100 flex justify-end'>
                                <button onClick={() => handleClickDelete(item.firebaseId)} className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 font-poppins'>Delete</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="flex justify-end mt-5">
                <button onClick={handleCheckout} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 font-poppins">Checkout</button>
            </div>
        </div>
    );
};

export default Checkout;
