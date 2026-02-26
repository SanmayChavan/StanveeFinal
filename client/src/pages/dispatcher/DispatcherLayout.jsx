// import React from 'react';
// import { Outlet, useNavigate } from 'react-router-dom';
// import { useAppContext } from '../../context/AppContext';
// import { toast } from 'react-hot-toast';
// import axios from 'axios';
// import stanvee_logo from "../../assets/stanvee_logo.png"

// const DispatcherLayout = () => {
//     const { setIsDispatcher } = useAppContext();
//     const navigate = useNavigate();

//     const handleLogout = async () => {
//         try {
//             const { data } = await axios.post('/api/dispatcher/logout');

//             if (data.success) {
//                 setIsDispatcher(false);
//                 toast.success("Logged Out");
//                 navigate('/'); // ✅ Redirect to Home Page
//             }
//         } catch (error) {
//             toast.error("Logout failed");
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 flex flex-col">

//             {/* Header */}
//             <nav className="flex justify-between items-center px-[5%] py-4 bg-white shadow-sm border-b sticky top-0 z-20">

//                 {/* Left Side */}
//                 <div className="flex items-center gap-4">
//                     <div className="bg-blue-600 text-white p-2 rounded-lg text-lg">
//                         📦
//                     </div>
//                     <div>
//                         <h1 className="text-xl font-bold text-gray-800 leading-tight">
//                             Dispatcher Panel
//                         </h1>
//                         <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">
//                             Logistics & Delivery
//                         </p>
//                     </div>
//                 </div>

//                 {/* Right Side */}
//                 <button
//                     onClick={handleLogout}
//                     className="bg-gray-800 hover:bg-black text-white px-6 py-2 rounded-full text-sm transition-all shadow-sm"
//                 >
//                     Logout
//                 </button>

//             </nav>

//             {/* Main Content */}
//             <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-8">
//                 <Outlet />
//             </main>

//             {/* Footer */}
//             <footer className="py-4 text-center text-xs text-gray-400">
//                 &copy; Stanvee Services India Limited
//             </footer>

//         </div>
//     );
// };

// export default DispatcherLayout;



import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import stanvee_logo from "../../assets/stanvee_logo.png";

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
        <div className="min-h-screen bg-gray-100 flex flex-col font-sans">

            {/* Header */}
            <nav className="flex justify-between items-center px-[5%] py-3 bg-white shadow-sm border-b sticky top-0 z-20">

                {/* Left Side: Stanvee Logo replacing text */}
                <div 
                    className="flex items-center cursor-pointer group" 
                    onClick={() => navigate('/dispatcher')}
                >
                    <img 
                        src={stanvee_logo} 
                        alt="Stanvee Logistics" 
                        className="h-10 w-auto object-contain transition-transform group-hover:scale-105" 
                    />
                    <div className="ml-4 pl-4 border-l border-gray-200 hidden md:block">
                        <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">
                            Dispatcher Panel
                        </span>
                    </div>
                </div>

                {/* Right Side: Logout Button */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLogout}
                        className="bg-gray-800 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 shadow-sm"
                    >
                        Logout
                    </button>
                </div>

            </nav>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 bg-white border-t border-gray-200 text-center">
                <p className="text-[11px] font-medium text-gray-500">
                    &copy; {new Date().getFullYear()} Stanvee Services India Limited | Internal Dispatch Portal
                </p>
            </footer>

        </div>
    );
};

export default DispatcherLayout;