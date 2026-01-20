// import React from 'react'
// import { useAppContext } from '../context/AppContext';
// import toast from 'react-hot-toast';

// const Login = () => {
//     const [state, setState] = React.useState("login");
//     const [name, setName] = React.useState("");
//     const [email, setEmail] = React.useState("");
//     const [password, setPassword] = React.useState("");
//     const {setShowUserLogin, setUser, axios, navigate} = useAppContext() ;

//     const onSubmitHandler = async(e) => {
        
//         try{
//             e.preventDefault() ;

//             const { data } = await axios.post(`/api/user/${state}`, {name, email, password}) ;
//             if(data.success){
//                 navigate('/') ;
//                 setUser(data.user) ;
//                 toast.success("Login Successfully")
//                 setShowUserLogin(false) ;
//             }else{
//                 toast.error(data.message) ;
//             }
//         }catch(err){
//             toast.error(err.message) ;
//         }
//     }

//     return (
//         <div onClick={() => setShowUserLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50 '>
//         <form onSubmit={(e) => onSubmitHandler(e)} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
//             <p className="text-2xl font-medium m-auto">
//                 <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
//             </p>
//             {state === "register" && (
//                 <div className="w-full">
//                     <p>Name</p>
//                     <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
//                 </div>
//             )}
//             <div className="w-full ">
//                 <p>Email</p>
//                 <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
//             </div>
//             <div className="w-full ">
//                 <p>Password</p>
//                 <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
//             </div>
//             {state === "register" ? (
//                 <p>
//                     Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
//                 </p>
//             ) : (
//                 <p>
//                     Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
//                 </p>
//             )}
//             <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
//                 {state === "register" ? "Create Account" : "Login"}
//             </button>
//         </form>
//         </div>
//     );
// };

// export default Login


import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { loginUser, setShowUserLogin } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      if (data.success) {
        toast.success('Login Successful');
        setShowUserLogin(false);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-4">User Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />
        <button className="bg-blue-500 text-white w-full py-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;
