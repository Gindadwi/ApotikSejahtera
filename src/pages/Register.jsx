// src/components/Register.jsx
import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState (false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if(password.length <8 ){
            setError('Password harus 8 karakter')
            return;
        }


        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Additional code to save username and phone to Firestore or Realtime Database
            console.log('User registered:', user);
            Swal.fire ({
                title: 'Berhasil',
                text: 'Register Succes',
                icon: 'success',
                confirmButtonText: 'OK',
            });

            // jika berhasil form akan kosong
            setEmail('');
            setUsername('');
            setPhone('');
            setPassword('');



        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setError('Email already')
            } 
            else {
                setError('Regristrasi error')
            }

            console.error('Error registering:', error)
        }
    };

    return (
        <div className="max-w-md mx-auto mt-5">
            <h1 className='leading-tight tracking-tight font-semibold text-xl my-5'>Create an account</h1>

            <form onSubmit={handleRegister} className="space-y-4">
                <div>
                    <label className="block">Username</label>
                    <input
                        type="text"
                        placeholder='username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        required
                    />
                </div>
                <div>
                    <label className="block">Email</label>
                    <input
                        type="email"
                        placeholder='name@gmail.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        required
                    />
                </div>
                <div>
                    <label className="block">Nomor HP</label>
                    <input
                        type="tel"
                        placeholder='+62••••••••••••'
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        required
                    />
                </div>
                <div>
                    <label className="block">Password</label>
                    <div className='relative'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='••••••••'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            required

                        />

                        {/* saat klik icon mata maka password akan terlihat */}
                        <button
                            type="button"
                            className="flex absolute right-3 top-3 w-5"
                            onClick={() => setShowPassword(!showPassword)} // Toggle visibilitas password
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Tampilkan ikon berdasarkan state */}
                        </button>
                    </div>
                    
                   
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-lg">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
