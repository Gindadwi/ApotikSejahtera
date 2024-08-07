import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Swal from 'sweetalert2';
import { CartContext } from '../components/common/CartContext';
import { toast } from 'react-toastify';
import CardObat2 from '../components/common/CardObat2';
import Cardobat from '../components/common/Cardobat';

export default function Obat() {
    const [user, setUser] = useState(null);
    const [modalContent, setModalContent] = useState(null);
    const { addToCart } = useContext(CartContext);
    const [harganormal, setHarganormal] = useState([]);
    const [diskonobat, setDiskonobat] = useState([]);

    // Menampilkan Obat
    const getObat = async () => {
        try {
            const [response1, response2] = await Promise.all([
                axios.get('https://simple-notes-firebase-8e9dd-default-rtdb.firebaseio.com/harganormal.json?auth=lXYJqqYjWNufQN2OReTueq5MaI53zeEsIbXDh0zy'),
                axios.get('https://simple-notes-firebase-8e9dd-default-rtdb.firebaseio.com/diskonobat.json?auth=lXYJqqYjWNufQN2OReTueq5MaI53zeEsIbXDh0zy')
            ]);

            // Handling response from first API
            const dataArray1 = Array.isArray(response1.data)
                ? response1.data
                : Object.keys(response1.data).map(key => ({
                    id: key,
                    ...response1.data[key]
                }));
            const limiterData1 = dataArray1.slice(0, 8);

            // Handling response from second API
            const dataArray2 = Array.isArray(response2.data)
                ? response2.data
                : Object.keys(response2.data).map(key => ({
                    id: key,
                    ...response2.data[key]
                }));
            const limiterData2 = dataArray2.slice(0, 8);

            // Update state with the separated data
            setHarganormal(limiterData1);
            setDiskonobat(limiterData2);

            console.log('Response from first API:', response1.data);
            console.log('Response from second API:', response2.data);
        } catch (error) {
            console.log('Error fetching data', error);
        }
    };

    // Jika user mau memunculkan modal harus login terlebih dahulu
    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null)
            }
        });
        getObat();
    }, []);

    // Memunculkan Modal Content
    const handleClickModal = (item) => {
        if (user) {
            setModalContent(item);
            const modal = new Modal(document.getElementById('skill-modal'));
            modal.show();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Harus Login!',
                text: 'Mohon login terlebih dahulu untuk bisa akses fitur lainya.',
                customClass: {
                    confirmButton: 'swal2-confirm-custom'
                }
            });
        }
    }

    // Menutup Modal Content
    const closeModal = () => {
        setModalContent(null);
        const modal = new Modal(document.getElementById('skill-modal'));
        modal.hide();
    }

    // Menambahkan ke keranjang
    const handleAddToCart = (item) => {
        if (user) {
            addToCart(item);

            axios.post(`https://simple-notes-firebase-8e9dd-default-rtdb.firebaseio.com/cart/${user.uid}.json?auth=lXYJqqYjWNufQN2OReTueq5MaI53zeEsIbXDh0zy`, item)
                .then(response => {
                    console.log('Item added to cart in Firebase:', response.data);
                    toast.success("Item berhasil ditambahkan ke keranjang!");

                })
                .catch(error => {
                    console.error('Error adding item to cart in Firebase:', error);
                });

            closeModal();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Harus Login!',
                text: 'Mohon login terlebih dahulu untuk bisa akses fitur lainya.',
                customClass: {
                    confirmButton: 'swal2-confirm-custom'
                }
            });
        }
    };

    return (
        <div className='mt-5 container mx-auto lg:max-w-[720px] lg:w-full'>
            <h1 className='text-center font-baloo text-[24px] lg:text-[36px] mb-2'>Obat Obatan</h1>
            <div className='grid grid-cols-2 mx-3 gap-5 lg:grid-cols-4 lg:mx-0'>
                {harganormal.map(item => (
                    <Cardobat
                        key={item.id}
                        image={item.image}
                        title={item.name}
                        kegunaan={item.use}
                        hargadiskon={item.price}
                        onClick={() => handleClickModal(item)}
                    />
                ))}
            </div>
            <div className='grid grid-cols-2 mx-3 gap-5 lg:grid-cols-4 lg:mx-0 mt-4 '>
                {diskonobat.map(item => (
                    <CardObat2
                        key={item.id}
                        title={item.name}
                        kegunaan={item.dosage}
                        diskon={item.discount}
                        hargaasli={item.price}
                        hargadiskon={item.discounted_price}
                        onClick={() => handleClickModal(item)}
                    />
                ))}
            </div>
            {modalContent && (
                <div id="skill-modal" data-modal-backdrop="static" tabIndex="-1" aria-hidden="true" className="fixed bg-black bg-opacity-50 h-screen flex items-center justify-center top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:h-full">
                    <div className="relative w-full h-full max-w-2xl md:h-auto lg:w-[500px]">
                        <div className="relative bg-white rounded-lg shadow-lg">
                            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600 bg-gradient-to-r from-blue-500 to-purple-500">
                                <h3 className="text-lg font-medium text-white">Product Details</h3>
                                <button onClick={closeModal} type="button" className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="skill-modal">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6">
                                <img className="w-full h-64 object-cover rounded-lg shadow-md" src={modalContent.image} alt={modalContent.name} />
                                <div className="mt-4">
                                    <h4 className="text-2xl font-bold text-gray-900 font-poppins">{modalContent.name}</h4>
                                    <p className="mt-2 text-gray-700 font-poppins">Dosis Pemakaian Obat:</p>
                                    <p className="text-base text-gray-600 font-poppins">- {modalContent.dosage}</p>
                                    <p className="text-gray-700 line-through">Harga Normal: {modalContent.discounted_price}</p>
                                    <p className="text-red-600 font-semibold mt-4 text-lg text-right">Rp {modalContent.price}</p>
                                </div>
                                <div className="flex justify-end mt-6">
                                    <button onClick={() => handleAddToCart(modalContent)} className="px-8 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-poppins transition duration-300">Tambah ke Keranjang</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
