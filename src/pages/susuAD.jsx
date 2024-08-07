import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Cardobat from '../components/common/Cardobat';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Swal from 'sweetalert2';
import {toast} from 'react-toastify';
import { CartContext } from '../components/common/CartContext';

const SusuAD = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalContent, setModalContent] = useState(null);
    const [user, setUser] = useState(null);
    const {addToCart} = useContext(CartContext)

    useEffect(() => {
        const fetchSusu = async () => {
            try {
                const response = await axios.get('https://simple-notes-firebase-8e9dd-default-rtdb.firebaseio.com/susuAnakDewasa.json?auth=lXYJqqYjWNufQN2OReTueq5MaI53zeEsIbXDh0zy');
                console.log('Data fetched from API', response.data);
                const dataArray = Array.isArray(response.data) ? response.data : Object.values(response.data);                
                setData(response.data);
                setData(dataArray)
            } catch (error) {
                console.log('Error fetching data:', error);
                setError(error);
            } finally {
                setLoading(() => setLoading(false), 8000);
            }
        };


        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
            } else {
                setUser(null);
            }
        });


        fetchSusu();
    }, []);


    
    if (loading) {
        return <div className='text-center font-poppins text-[18px] lg:text-[20px]'>Loading Dulu Gaes...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }


    const handleClickModal = (item) => {
        if(user){
            setModalContent(item);
            const modal = Modal (document.getElementById('skill-modal'))
            modal.show();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Harus Login!',
                text: 'Mohon login terlebih dahulu untuk bisa akses fitur lainya.',
                customClass: {
                    confirmButton: 'swal2-confirm-custom'
                } 
            })
        }
    }

    const closeModal = () => {
        setModalContent(null);
        const modal = Modal(document.getElementById('skill-modal'))
        modal.hide();
    }



    const handleAddToCart = (item) => {
        if (user) {
            addToCart(item);
            axios.post(`https://simple-notes-firebase-8e9dd-default-rtdb.firebaseio.com/cart/${user.uid}.json?auth=lXYJqqYjWNufQN2OReTueq5MaI53zeEsIbXDh0zy`, item)
            .then(response => {
                console.log('Item added to cart in Firebase:', response.data);
            })
            .catch(error => {
                console.error('Error adding item to cart in Firebase:', error);
            });

            closeModal();
            toast.success("Item berhasil ditambahkan ke keranjang!");
        }else{
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

    return (
        <div className='mt-5 container mx-auto lg:max-w-[720px] lg:w-full'>
            <div>
                <h1 className='text-center font-baloo text-[20px] lg:text-[26px]'>Susu Anak dan Dewasa</h1>
            </div>

            <div className='flex gap-2 items-center justify-center flex-wrap'>
                
                <div className='grid grid-cols-2 gap-2 lg:grid-cols-4'>
                    {data.map(item => (
                        <Cardobat
                            key={item.id}
                            image={item.image}
                            title={item.name}
                            kegunaan={item.description}
                            hargadiskon={item.price}
                            onClick={() => handleClickModal(item)}
                        />
                    ))}                
                </div>
              
                {modalContent && (
                    <div id="skill-modal" data-modal-backdrop="static" tabIndex="-1" aria-hidden="true" className="fixed bg-black bg-opacity-50 h-screen flex items-center justify-center top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto  md:h-full">
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
                                        <p className='mt-4 font-poppins font-bold lg:text-2xl' >{modalContent.name}</p>
                                        <p className='mt-2 font-poppins'>Dosis Pemakaian Obat :</p>
                                        <p className='text-base font-poppins'>- {modalContent.dosage}</p>
                                        <p className='text-red-800 font-poppins font-semibold mt-4 text-end'>Rp {modalContent.price}</p>
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
        </div>
    );
};

export default SusuAD;
