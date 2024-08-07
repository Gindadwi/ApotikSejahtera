import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import Cardobat from '../components/common/Cardobat'
import Card from '../components/common/Card'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Swal from 'sweetalert2';
import { CartContext } from './common/CartContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const SearchResults = () => {
    const location = useLocation(); // Hook untuk mengakses objek lokasi saat ini
    const query = new URLSearchParams(location.search).get('query'); // Mengambil parameter 'query' dari URL
    const [results, setResults] = useState([]); // State untuk menyimpan hasil pencarian
    const [loading, setLoading] = useState(true); // State untuk menangani status pemuatan
    const [modalContent, setModalContent] = useState([]);
    const [user, setUser] = useState(null);
    const { addToCart } = useContext(CartContext);


    useEffect(() => {
        const fetchResults = () => {
            const db = getDatabase(); // Mendapatkan referensi ke Firebase Realtime Database
            const drugsRef = ref(db, 'harganormal'); // Referensi ke path 'harganormal' di database
            const discountDrugsRef = ref(db, 'diskonobat'); // Referensi ke path 'diskonobat' di database

            let fetchedResults = []; // Array untuk menyimpan hasil yang diambil

            // Fungsi untuk mengambil data dari referensi tertentu
            const fetchData = (reference) => {
                return new Promise((resolve) => {
                    onValue(reference, (snapshot) => {
                        const data = snapshot.val(); // Mengambil snapshot data dari referensi
                        resolve(data ? Object.values(data) : []); // Resolusi dengan array data atau kosong jika tidak ada data
                    });
                });
            };

            // Mengambil data dari kedua referensi (obat normal dan diskon)
            Promise.all([fetchData(drugsRef), fetchData(discountDrugsRef)]).then((values) => {
                const [drugsData, discountDrugsData] = values; // Memisahkan hasil dari kedua referensi

                // Memfilter data jika ada query, jika tidak tampilkan semua data
                if (query && query.trim() !== "") {
                    const filteredDrugs = drugsData.filter((drug) =>
                        drug.name.toLowerCase().includes(query.toLowerCase())
                    );
                    const filteredDiscountDrugs = discountDrugsData.filter((drug) =>
                        drug.name.toLowerCase().includes(query.toLowerCase())
                    );

                    fetchedResults = [...filteredDrugs, ...filteredDiscountDrugs]; // Gabungkan hasil filter
                } else {
                    fetchedResults = [...drugsData, ...discountDrugsData]; // Gabungkan semua data jika tidak ada query
                }

                setResults(fetchedResults); // Set hasil pencarian ke state
                setLoading(false); // Set status pemuatan ke false
            });
        };


        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if(user){
                setUser(user)
            }else{
                setUser(null)
            }
        })

        fetchResults(); // Memanggil fungsi untuk mengambil hasil pencarian
    }, [query]); // useEffect akan dipanggil ulang jika query berubah

    const handleClickModal = (item) => {
        if(user){
            setModalContent(item);
            const modal = new Modal(document.getElementById('skill-modal'));
            modal.show();
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

    const closeModal = () => {
        setModalContent(null);
        const modal = new Modal(document.getElementById('skill-modal'));
        modal.hide();
    }


    const handleAddToCart = (item) => {
        if(user){
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
        <div className="container mx-3 lg:mx-auto mt-0 lg:max-w-[720px] lg:w-full">
            <h2 className="text-2xl font-bold mb-4">Search Results</h2>
            {loading ? ( // Menampilkan teks 'Loading...' jika data masih dimuat
                <p>Loading...</p>
            ) : results.length > 0 ? ( // Menampilkan hasil pencarian jika ada hasil
                    <ul className='lg:grid lg:grid-cols-4 lg:gap-4 lg:mx-2 mx-3'>
                    {results.map((item, index) => (
                        <>
                            <div>
                                <Card
                                    cardClass='lg:w-[150px] lg:h-[185px]'
                                    key={index}
                                    title={item.name}
                                    kegunaan={item.use}
                                    hargadiskon={item.price}
                                    onClick={() => handleClickModal(item)}
                                />
                            </div>
                          
                        </>

                    ))}
                        
                </ul>
                
            ) : ( // Menampilkan pesan 'No results found.' jika tidak ada hasil pencarian
                <p>No results found.</p>
            )}{modalContent && (
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
    );
};

export default SearchResults;
