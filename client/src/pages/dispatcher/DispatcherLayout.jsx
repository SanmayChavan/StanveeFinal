import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const DispatcherLayout = () => {
    const { setIsDispatcher } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const { data } = await axios.post('/api/dispatcher/logout');

            if (data.success) {
                setIsDispatcher(false);
                toast.success("Logged Out");
                navigate('/'); // ✅ Redirect to Home Page
            }
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">

            {/* Header */}
            <nav className="flex justify-between items-center px-[5%] py-4 bg-white shadow-sm border-b sticky top-0 z-20">

                {/* Left Side */}
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600 text-white p-2 rounded-lg text-lg">
                        📦
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 leading-tight">
                            Dispatcher Panel
                        </h1>
                        <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">
                            Logistics & Delivery
                        </p>
                    </div>
                </div>

                {/* Right Side */}
                <button
                    onClick={handleLogout}
                    className="bg-gray-800 hover:bg-black text-white px-6 py-2 rounded-full text-sm transition-all shadow-sm"
                >
                    Logout
                </button>

            </nav>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-8">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="py-4 text-center text-xs text-gray-400">
                &copy; 2026 Dispatcher Management System v1.0
            </footer>

        </div>
    );
};

export default DispatcherLayout;