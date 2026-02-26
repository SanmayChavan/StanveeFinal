import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const DispatcherLogin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Accessing context to update dispatcher state
    const { setIsDispatcher, backendUrl } = useAppContext()

    // Inside DispatcherLogin.jsx
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            // No need for 'backendUrl +' because of axios.defaults.baseURL
            const { data } = await axios.post('/api/dispatcher/login', { email, password });

            if (data.success) {
                setIsDispatcher(true);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login Failed");
        }
    };

    return (
        <div className='min-h-[80vh] flex items-center justify-center px-5'>
            <form
                onSubmit={onSubmitHandler}
                className='flex flex-col items-center w-[90%] sm:max-w-md m-auto mt-14 gap-4 text-gray-800 bg-white p-8 rounded-lg shadow-md border border-gray-100'
            >
                <div className='inline-flex items-center gap-2 mb-2 mt-2'>
                    <hr className='border-none h-[1.5px] w-8 bg-blue-600' />
                    <p className='text-3xl font-bold text-blue-600'>Dispatcher Login</p>
                    <hr className='border-none h-[1.5px] w-8 bg-blue-600' />
                </div>

                <p className='text-sm text-gray-500 mb-4'>Enter your credentials to access the shipping panel</p>

                <input
                    type="email"
                    className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-blue-400'
                    placeholder='Email'
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />

                <input
                    type="password"
                    className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-blue-400'
                    placeholder='Password'
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />

                <button className='bg-blue-600 text-white font-light px-8 py-2 mt-4 w-full rounded hover:bg-blue-700 transition-all'>
                    Login
                </button>

                <p className='text-xs text-gray-400 mt-2 italic'>
                    * Authorized Dispatcher Access Only
                </p>
            </form>
        </div>
    )
}

export default DispatcherLogin