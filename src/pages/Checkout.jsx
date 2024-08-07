import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

const CheckoutPage = () => {
    const location = useLocation();
    const selectedItems = location.state?.selectedItems || []; // Dapatkan item yang dipilih dari state navigasi
    const auth = getAuth();
    const user = auth.currentUser;
    const [orderDetails, setOrderDetails] = useState({
        address: '',
        paymentMethod: 'credit_card',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderDetails({ ...orderDetails, [name]: value });
    };

    const handlePlaceOrder = async () => {
        if (user) {
            try {
                const idToken = await user.getIdToken(true);
                const order = {
                    userId: user.uid,
                    items: selectedItems,
                    orderDetails,
                    timestamp: new Date().toISOString(),
                };
                await axios.post(`https://simple-notes-firebase-8e9dd-default-rtdb.firebaseio.com/orders.json?auth=lXYJqqYjWNufQN2OReTueq5MaI53zeEsIbXDh0zy`, order);
                alert('Order placed successfully!');
                // Clear cart after placing order
            } catch (error) {
                console.error('Error placing order:', error);
            }
        }
    };

    return (
        <div className='container mx-auto p-5'>
            <h1 className='text-center font-baloo text-[24px] lg:text-[36px] mb-5'>Checkout</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div className='bg-white border rounded-lg shadow-lg p-5'>
                    <h2 className='font-semibold font-poppins text-lg mb-4'>Order Summary</h2>
                    <ul>
                        {selectedItems.map(item => (
                            <li key={item.firebaseId} className="flex justify-between border-b py-2">
                                <span>{item.name}</span>
                                <span>{item.price}</span>
                            </li>
                        ))}
                    </ul>
                    <div className='flex justify-between mt-4 font-bold'>
                        <span>Total</span>
                        <span>{selectedItems.reduce((total, item) => total + parseFloat(item.price), 0)}</span>
                    </div>
                </div>
                <div className='bg-white border rounded-lg shadow-lg p-5'>
                    <h2 className='font-semibold font-poppins text-lg mb-4'>Shipping Details</h2>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Address</label>
                        <input
                            type='text'
                            name='address'
                            value={orderDetails.address}
                            onChange={handleInputChange}
                            className='w-full px-4 py-2 border rounded-lg'
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Payment Method</label>
                        <select
                            name='paymentMethod'
                            value={orderDetails.paymentMethod}
                            onChange={handleInputChange}
                            className='w-full px-4 py-2 border rounded-lg'
                        >
                            <option value='credit_card'>Credit Card</option>
                            <option value='paypal'>PayPal</option>
                            <option value='bank_transfer'>Bank Transfer</option>
                        </select>
                    </div>
                    <button
                        onClick={handlePlaceOrder}
                        className='w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 font-poppins'
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
