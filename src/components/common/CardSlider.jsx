import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import Card from './Card'; // Ensure the path is correct according to your project structure
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import arrow from '../../assets/arrow.png';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import { CartContext } from './CartContext';

// Fungsi untuk memformat angka menjadi format rupiah
const formatRupiah = (angka) => {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const CardSlider = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null); // State for user authentication
    const sliderRef = useRef(null);
    const [modalContent, setModalContent] = useState(null);
    const {addToCart} = useContext(CartContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://simple-notes-firebase-8e9dd-default-rtdb.firebaseio.com/diskonobat.json?auth=lXYJqqYjWNufQN2OReTueq5MaI53zeEsIbXDh0zy');
                console.log('Data fetched from API:', response.data);
                setData(response.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleClickModal = (content) => {
        if (user) {
            setModalContent(content);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Harus Login!',
                text: 'Mohon login terlebih dahulu untuk bisa akses fitur lainnya.',
                customClass: {
                    confirmButton: 'swal2-confirm-custom'
                }
            });
        }
    }

    const closeModal = () => {
        setModalContent(null);
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1080,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 360,
                settings: {
                    slidesToShow: 2.5,
                    slidesToScroll: 2
                }
            }
        ]
    };


    const handleAddToCart = (item) => {
        if(user){
            addToCart(item);
            
            axios.post(`https://simple-notes-firebase-8e9dd-default-rtdb.firebaseio.com/cart/${user.uid}.json?auth=lXYJqqYjWNufQN2OReTueq5MaI53zeEsIbXDh0zy`, item)
            .then(response => {
                console.log('Item added to cart in Firebase:', response.data);
                toast.success("Item berhasil ditambahkan ke keranjang!");           
            })

            .catch(error => {
                console.error('error lur', error);
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
        <div className="container mx-auto mt-0 lg:max-w-[720px] lg:w-full relative">
            <Slider ref={sliderRef} {...settings}>
                {data && Object.keys(data).map((key) => (
                    <div className="p-2" key={key}>
                        <Card
                            cardClass=''
                            image={data[key].image}
                            diskon={data[key].discount}
                            title={data[key].name}
                            hargaasli={formatRupiah(data[key].price)}
                            hargadiskon={formatRupiah(data[key].discounted_price)}
                            onClick={() => handleClickModal(data[key])}
                        />
                    </div>
                ))}
            </Slider>


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
                                    <p className="text-gray-700 line-through">Harga Normal: {formatRupiah(modalContent.price)}</p>
                                    <p className="text-red-600 font-semibold mt-4 text-lg text-right">Rp {formatRupiah(modalContent.discounted_price)}</p>
                                </div>
                                <div className="flex justify-end mt-6">
                                    <button onClick={() => handleAddToCart(modalContent)} className="px-8 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-poppins transition duration-300">Tambah ke Keranjang</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <button
                className="absolute top-1/2 left-[-10px] lg:left-[-5px] transform -translate-y-1/2 rotate-180"
                onClick={() => sliderRef.current.slickPrev()}
            >
                <img src={arrow} alt="Previous" className='w-[25px]' />
            </button>
            <button
                className="absolute top-1/2 right-[-10px] lg:right-[-5px] transform -translate-y-1/2"
                onClick={() => sliderRef.current.slickNext()}
            >
                <img src={arrow} alt="Next" className='w-[25px]' />
            </button>
        </div>
    );
};

export default CardSlider;
