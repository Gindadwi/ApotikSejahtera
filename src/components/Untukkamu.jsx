import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Cardobat from './common/Cardobat';
import Swal from 'sweetalert2';
import Button from './common/Button';
import { CartContext } from './common/CartContext';
import { toast } from 'react-toastify';
import { Navigate, useNavigate } from 'react-router-dom';

// Fungsi untuk memformat angka menjadi format rupiah
const formatRupiah = (angka) => {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const Untukkamu = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalContent, setModalContent] = useState(null);
    const [user, setUser] = useState(null);
    const { addToCart } = useContext(CartContext);
    const Navigate = useNavigate();

    const getKamu = async () => {
        try {
            const response = await axios.get('https://simple-notes-firebase-8e9dd-default-rtdb.firebaseio.com/harganormal.json?auth=lXYJqqYjWNufQN2OReTueq5MaI53zeEsIbXDh0zy');
            const dataArray = Array.isArray(response.data)
                ? response.data
                : Object.keys(response.data).map(key => ({
                    id: key,
                    ...response.data[key]
                }));
            const limitedData = dataArray.slice(0, 8);
            setData(limitedData);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error);
        } finally {
            setLoading(() => setLoading(false), 8000);
        }
    };

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        getKamu();
    }, []);

    if (loading) return <p className='text-center font-poppins text-[18px] lg:text-[20px]'>Loading dulu gaes...</p>;
    if (error) return <p>Error: {error.message}</p>;

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
    };

    const closeModal = () => {
        setModalContent(null);
        const modal = new Modal(document.getElementById('skill-modal'));
        modal.hide();
    };

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
            <div>
                <h1 className='text-center font font-baloo text-[20px] mb-5 lg:text-[24px]'>Untuk Kamu</h1>
            </div>

            <div className='flex items-center justify-center mr-2'>
                <div className='grid grid-cols-2 gap-5 lg:grid-cols-4'>
                    {data.map(item => (
                        <Cardobat
                            key={item.id}
                            image={item.image}
                            title={item.name}
                            kegunaan={item.use}
                            hargadiskon={formatRupiah(item.price)}
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
                                        <h4 className="text-2xl font-bold text-gray-900 font-poppins">{modalContent.name}</h4>
                                        <p className="mt-2 text-gray-700 font-poppins">Dosis Pemakaian Obat:</p>
                                        <p className="text-base text-gray-600 font-poppins">- {modalContent.dosage}</p>
                                        <p className="text-red-600 font-semibold mt-4 text-lg text-right">Rp {formatRupiah(modalContent.price)}</p>
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
            <div className='justify-center items-center flex '>
                <Button
                    name="Lihat Lebih Banyak"
                    type='Button'
                    className={'py-2 mt-5 lg:w-[250px] lg:h-[50px]'}
                    onClick = {() => Navigate('/Obat')}
                />
            </div>
        </div>
    );
};

export default Untukkamu;
