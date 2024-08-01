// src/components/SocialMediaIcons.js
import React from 'react';
import { FaTiktok, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const SocialMedia = () => {
    return (
        <div className="flex space-x-4  ">
            <div className="bg-white p-4 rounded-full shadow-lg transform 
            transition-transform duration-300 hover:scale-125"
                onClick={() => window.location.href = 'https://www.tiktok.com/@jawanese.sann?_t=8nsJHQKVZ7C&_r=1'}>
                <FaTiktok className="text-blue-600" />
            </div>
            <div className="bg-white p-4 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-125"
                onClick={() => window.location.href = 'https://www.instagram.com/ginda.sann?igsh=NDQ3YXUzcDVhcWw3'}>
                <FaInstagram className="text-pink-600" />
            </div>
            <div className="bg-white p-4 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-125"
                onClick={() => window.location.href = 'https://www.linkedin.com/in/ginda-dwi-660060295?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'}>
                <FaLinkedinIn className="text-blue-700" />
            </div>
        </div>
    );
}

export default SocialMedia;
