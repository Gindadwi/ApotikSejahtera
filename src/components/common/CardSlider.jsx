import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import Card from './Card'; // Ensure the path is correct according to your project structure
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import arrow from '../../assets/arrow.png';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const CardSlider = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null); // State for user authentication
    const sliderRef = useRef(null);
    const [modalContent, setModalContent] = useState(null);

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
                            hargaasli={data[key].price}
                            hargadiskon={data[key].discounted_price}
                            onClick={() => handleClickModal(data[key])}
                        />
                    </div>
                ))}
            </Slider>
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
                                <img src={modalContent.image} alt={modalContent.name} className="w-full h-auto mb-4" />
                                <strong className="block text-lg">{modalContent.name}</strong>
                                <p className="text-gray-700">{modalContent.use}</p>
                                <p className="text-gray-700">Original Price: {modalContent.price}</p>
                                <p className="text-gray-700">Discounted Price: {modalContent.discounted_price}</p>
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
