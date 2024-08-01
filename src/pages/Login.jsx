import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState (false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            onLoginSuccess();
            navigate('/');
        } catch (error) {
            console.error("Error logging in with email and password:", error);
        }
    };

    const handleGoogleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithPopup(auth, googleProvider);
            onLoginSuccess();
            navigate('/');
        } catch (error) {
            console.error("Error logging in with Google:", error);
        }
    };

    return (
        <div>
            <div className="max-w-md mx-auto ">
                <h1 className='leading-tight tracking-tight font-semibold text-xl my-5 lg:'>Sign in to your account</h1>
                <form onSubmit={handleLogin} className="space-y-4">
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
                    <div className='relative'> 
                        <label className="block">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder='••••••••'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                        <button
                            type='button'
                            className="flex absolute right-3 top-10 w-5"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye /> }
                        </button>
                    </div>


                    <h3 className='text-blue-500 text-right text-sm' >Forgot password</h3>

                    <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-lg 
                    font-poppins ">
                        Login
                    </button>
                </form>
                <button onClick={handleGoogleLogin} className="w-full p-2 mt-4 rounded-lg bg-red-500 text-white">
                    Login with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
