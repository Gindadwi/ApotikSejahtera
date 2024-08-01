import React, { useContext, useEffect, useState } from 'react'
import Cardobat from '../components/common/Cardobat'
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Swal from 'sweetalert2';
import { CartContext } from '../components/common/CartContext';
import { toast } from 'react-toastify';


export default function Obat() {
    const [data, setData] = useState([]);
    const [user, setUser] = useState(null);
    const [modalContent, setModalContent] = useState(null)
    const { addToCart } = useContext(CartContext);

    // Menampilkan Obat
    const getObat = async () => {
        try {
            const response = await axios.get('https://simple-notes-firebase-8e9dd-default-rtdb.firebaseio.com/harganormal.json?auth=lXYJqqYjWNufQN2OReTueq5MaI53zeEsIbXDh0zy');
            const dataArray = Array.isArray(response.data)
                ? response.data
                : Object.keys(response.data).map(key => ({
                    id: key,
                    ...response.data[key]
                }));
            const limiterData = dataArray.slice(0.8);
            setData(limiterData);
            console.log(response.data)
        } catch (error) {
            console.log('erro data', error)
        }
    }

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
                })
                .catch(error => {
                    console.error('Error adding item to cart in Firebase:', error);
                });

            closeModal();
            toast.success("Item berhasil ditambahkan ke keranjang!");
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
        <div className='mt-5 container mx-auto lg:max-w-[720px] lg:w-full '>
            <h1 className='text-center font-baloo text-[24px] lg:text-[36px] mb-2'>Obat Obatan</h1>
            <div className='grid grid-cols-2 mx-3 gap-5 lg:grid-cols-4 lg:mx-0'>
                {data.map(item => (
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
            {modalContent && (
                <div id="skill-modal" data-modal-backdrop="static" tabIndex="-1" aria-hidden="true" className="fixed bg-black bg-opacity-50 items-center justify-center flex top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto h-modal md:h-full">
                    <div className="relative w-full h-full max-w-2xl md:h-auto lg:w-[500px]">
                        <div className="relative bg-white rounded-lg shadow">
                            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                <button onClick={closeModal} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="skill-modal">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6">
                                <p className="text-base mt-[-20px] leading-relaxed text-back font-poppins text-left dark:text-gray-400">
                                    <img src={modalContent.image} alt={modalContent.name} />
                                    <p className='mt-4 font-poppins font-bold' >{modalContent.name}</p>
                                    <p className='mt-2 font-poppins'>Dosis Pemakaian Obat :</p>
                                    <p className='text-base font-poppins'>- {modalContent.dosage}</p>
                                    <p className='text-red-800 font-poppins font-semibold mt-4 text-end'>Rp {modalContent.price}</p>
                                </p>
                                <div className='items-end flex justify-end mt-5'>
                                    <button onClick={() => handleAddToCart(modalContent)} className='px-8 bg-blue-600 w-[150px] h-[35px] rounded-lg text-white font-poppins text-center'>Keranjang</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}    

        </div>
    )
}


