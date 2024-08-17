import React, { useState } from 'react'
import lupaPassword from '../assets/lupaPassword.png'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import Swal from 'sweetalert2';

const LupaPassword = () => {


    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');


    const handleLupaPassword = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        try {
            await sendPasswordResetEmail(auth, email);
            Swal.fire({
                title: 'Email Terkirim!',
                text: 'Silakan periksa email Anda untuk mereset password.',
                icon: 'success',
            });
        } catch (error) {
            Swal.fire({
                title: 'Terjadi Kesalahan',
                text: 'Periksa email Anda dan coba lagi.',
                icon: 'error',
            });
        }
    }


    return (
        <div className='container mx-auto mt-0 lg:max-w-[720px] lg:w-full text-center justify-center items-center '>
            <div className=' w-full  lg:my-[100px]  lg:shadow-md lg:border lg:border-gray-200 rounded-lg  py-[70px]'>
                <img src={lupaPassword} alt="" className='lg:w-[100px] w-[70px] mx-auto justify-center items-center' />
                <h1 className='font-baloo lg:text-[28px] text-[20px] mt-3'>Trouble Logging In?</h1>
                <p className='font-poppins lg:text-[18px] text-[14px]'>masukan email anda untuk mereset password</p>
                <div>

                    <form onSubmit={handleLupaPassword} className=''>
                        <div>
                            <input
                                className='lg:w-[400px] rounded-lg mt-3 w-[300px]'
                                type="email"
                                placeholder='Masukan Email Anda'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type='submit' className='w-[200px] bg-blue-700 mt-3 py-[10px] rounded-lg font-poppins text-white lg:-mr-[200px] -mr-[100px]'>Reset Password</button>
                    </form>

                </div>
            </div>

        </div>
    )
}

export default LupaPassword

