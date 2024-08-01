import React, { useState } from 'react';
import Banner1 from '../../assets/Banner1.png';
import Banner2 from '../../assets/Banner2.png';

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = [Banner1, Banner2];

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="flex justify-center mt-0 mb-3">
            <div className="relative w-full lg:max-w-[720px] lg:max-h-[300px] h-40 overflow-hidden rounded-lg md:h-96">
                {/* Carousel items */}
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute w-full h-full transition-opacity duration-700 ease-in-out ${currentIndex === index ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <img src={image} className="w-full h-full object-cover" alt={`Slide ${index + 1}`} />
                    </div>
                ))}
                {/* Slider controls */}
                <button
                    type="button"
                    className="absolute top-1/2 left-0 transform -translate-y-1/2 z-30 flex items-center justify-center h-full px-4 cursor-pointer"
                    onClick={prevSlide}
                >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30">
                        <svg className="w-4 h-4 text-white dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                        </svg>
                        <span className="sr-only">Previous</span>
                    </span>
                </button>
                <button
                    type="button"
                    className="absolute top-1/2 right-0 transform -translate-y-1/2 z-30 flex items-center justify-center h-full px-4 cursor-pointer"
                    onClick={nextSlide}
                >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30">
                        <svg className="w-4 h-4 text-white dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                        </svg>
                        <span className="sr-only">Next</span>
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Carousel;
