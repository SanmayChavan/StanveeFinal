// import React, { useState } from "react";
// import { NavLink, Link } from "react-router-dom";
// import {
//   FaList,
//   FaChevronDown,
//   FaChevronUp,
//   FaPhoneAlt,
//   FaEnvelope,
//   FaSearch,
//   FaTimes,
//   FaBars,
// } from "react-icons/fa";
// import toast from "react-hot-toast";
// import { assets } from "../assets/assets";
// import { useAppContext } from "../context/AppContext";
// import stanvee_logo from "../assets/stanvee_logo.png";
// const [profileOpen, setProfileOpen] = useState(false);


// const Navbar = () => {
//   const [showCategories, setShowCategories] = useState(false);
//   const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const {
//     user,
//     setUser,
//     setShowUserLogin,
//     navigate,
//     setSearchQuery,
//     searchQuery,
//     getCartCount,
//     axios,
//   } = useAppContext();

//   const categories = [
//     { name: "Audio Devices", path: "/products/audio" },
//     { name: "Dining", path: "/products/dining" },
//     { name: "Home Appliances", path: "/products/homeappliances" },
//     { name: "Home Essentials", path: "/products/homeessentials" },
//     { name: "Kitchen Appliances", path: "/products/kitchenappliances" },
//     { name: "Kitchen Essentials", path: "/products/kitchenessentials" },
//   ];

//   // const logout = async () => {
//   //   try {
//   //     const { data } = await axios.get("/api/user/logout");
//   //     if (data.success) {
//   //       toast.success(data.message);
//   //       setUser(null);
//   //       navigate("/");
//   //     }
//   //   } catch (err) {
//   //     toast.error(err.message || "Logout failed");
//   //   }
//   // };

//   const logout = async () => {
//     try {
//       // Explicitly using axios.get to match your router
//       const { data } = await axios.get("/api/user/logout", {
//         withCredentials: true
//       });

//       if (data.success) {
//         toast.success(data.message);

//         // Reset all auth-related states
//         setUser(null);
//         // setIsSeller(false);
//         // setCartItems({});

//         navigate("/");
//       }
//     } catch (err) {
//       console.error("Logout Error:", err);
//       toast.error(err.response?.data?.message || "Logout failed");
//     }
//   };

//   const handleMobileSearchClear = () => {
//     setSearchQuery("");
//     setMobileSearchOpen(false);
//   };

//   return (
//     <div className="w-full">
//       {/* TOP BAR */}
//       <div className="bg-[#203040] text-gray-200 text-[10px] md:text-sm">
//         <div className="max-w-7xl mx-auto flex items-center justify-between h-10 px-4">
//           {/* Left (Email + Phone — now both visible on mobile) */}
//           <div className="flex items-center gap-3">
//             <div className="flex items-center gap-1">
//               <FaEnvelope className="text-primary text-[12px]" />
//               <span>info@stanvee.com</span>
//             </div>

//             <div className="flex items-center gap-1">
//               <FaPhoneAlt className="text-primary text-[12px]" />
//               <span>+91 92705 21515</span>
//             </div>
//           </div>

//           {/* Right (links shown on md+) */}
//           <div className="hidden md:flex items-center gap-6 font-medium">
//             <Link to="/faq" className="hover:text-primary transition">
//               FAQ
//             </Link>
//             <Link to="/about" className="hover:text-primary transition">
//               About Us
//             </Link>
//             <Link to="/contact" className="hover:text-primary transition">
//               Contact Us
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* MAIN NAVBAR */}
//       <div className="bg-white sticky top-0 z-50 border-b border-gray-100">
//         {/* Upper Navbar */}
//         <div className="flex items-center justify-between px-4 py-4">
//           {/* Logo */}
//           <NavLink
//             to="/"
//             onClick={() => {
//               setSearchQuery("");
//               setMobileSearchOpen(false);
//               setMobileMenuOpen(false);
//             }}
//             className="flex items-center"
//           >
//             <div className="w-32 sm:w-40 h-10 sm:h-12">
//               <img
//                 src={stanvee_logo}
//                 alt="Stanvee"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </NavLink>

//           {/* Desktop Search */}
//           <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8 text-sm gap-2 px-4 py-2 rounded-full bg-gray-50">
//             <input
//               value={typeof searchQuery === "string" ? searchQuery : ""}
//               onChange={(e) => {
//                 setSearchQuery(e.target.value);
//                 if (e.target.value.trim()) navigate("/products");
//               }}
//               className="w-full bg-transparent outline-none"
//               placeholder="Search products..."
//             />
//             <FaSearch className="text-gray-600" />
//           </div>

//           {/* Right Icons */}
//           <div className="flex items-center gap-4 lg:gap-8">
//             {/* Mobile Search Toggle */}
//             <button
//               onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
//               className="text-lg md:hidden"
//             >
//               {mobileSearchOpen ? <FaTimes /> : <FaSearch />}
//             </button>

//             {/* Cart */}
//             <div
//               onClick={() => navigate("/cart")}
//               className="flex items-center gap-2 cursor-pointer"
//             >
//               <span className="hidden lg:block text-sm font-medium">
//                 My Cart
//               </span>
//               <div className="relative">
//                 <img
//                   src={assets.nav_cart_icon}
//                   alt="cart"
//                   className="w-6"
//                 />
//                 <span className="absolute -top-2 -right-3 text-xs bg-primary text-white w-[18px] h-[18px] rounded-full flex items-center justify-center">
//                   {getCartCount()}
//                 </span>
//               </div>
//             </div>

//             {/* User / Login */}
//             {!user ? (
//               <button
//                 onClick={() => setShowUserLogin(true)}
//                 className="px-6 py-2 bg-primary text-white rounded-full text-sm font-medium"
//               >
//                 Login
//               </button>
//             ) : (
//               <div className="relative group">
//                 <img
//                   src={assets.profile_icon}
//                   className="w-10 cursor-pointer"
//                   alt="profile"
//                 />
//                 <ul className="hidden group-hover:block absolute right-0 top-10 bg-white border shadow-lg rounded-md w-32 text-sm">
//                   <li
//                     onClick={() => navigate("/my-orders")}
//                     className="px-3 py-2 hover:bg-primary/10 cursor-pointer"
//                   >
//                     My Orders
//                   </li>
//                   <li
//                     onClick={logout}
//                     className="px-3 py-2 hover:bg-primary/10 text-red-500 cursor-pointer"
//                   >
//                     Logout
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Mobile Search Input */}
//         {mobileSearchOpen && (
//           <div className="md:hidden px-4 pb-2 relative w-auto">
//             <input
//               value={typeof searchQuery === "string" ? searchQuery : ""}
//               onChange={(e) => {
//                 setSearchQuery(e.target.value);
//                 if (e.target.value.trim()) navigate("/products");
//               }}
//               className="w-full px-3 py-2 border rounded-full outline-none text-sm"
//               placeholder="Search products..."
//               autoFocus
//             />
//             <FaTimes
//               onClick={handleMobileSearchClear}
//               className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
//             />
//           </div>
//         )}

//         {/* Bottom Navbar */}
//         <div className="bg-white py-3 px-4 shadow-md flex items-center gap-4 md:gap-10">

//           {/* All Categories */}
//           <div className="relative">
//             <button
//               onClick={() => setShowCategories(!showCategories)}
//               className="flex items-center rounded-full bg-[#f5f7fa] hover:bg-[#2b8f72] hover:text-white transition pr-5"
//             >
//               <div className="w-10 h-10 bg-[#2b8f72] rounded-full flex items-center justify-center text-white">
//                 <FaList />
//               </div>
//               <span className="px-4 font-medium">All Categories</span>
//               {showCategories ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
//             </button>

//             {showCategories && (
//               <div className="absolute top-full mt-2 w-64 bg-white shadow-xl rounded-xl overflow-hidden z-50">
//                 {categories.map((cat) => (
//                   <Link
//                     key={cat.path}
//                     to={cat.path}
//                     onClick={() => setShowCategories(false)}
//                     className="block px-4 py-3 font-medium hover:bg-gray-100 border-b border-gray-200"
//                   >
//                     {cat.name}
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Mobile Menu Icon */}
//           <button
//             className="md:hidden text-xl"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           >
//             {mobileMenuOpen ? <FaTimes /> : <FaBars />}
//           </button>

//           {/* Desktop Links */}
//           <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
//             <NavLink to="/" className="hover:text-primary">Home</NavLink>
//             <NavLink to="/products" className="hover:text-primary">Shop</NavLink>
//             <NavLink to="/about" className="hover:text-primary">About Us</NavLink>
//             <NavLink to="/contact" className="hover:text-primary">Contact Us</NavLink>
//           </div>

//         </div>

//         {/* Mobile Menu Dropdown */}
//         {mobileMenuOpen && (
//           <div className="md:hidden px-4 pb-4 text-sm font-medium mt-3 space-y-2">
//             <NavLink
//               to="/"
//               onClick={() => setMobileMenuOpen(false)}
//               className="block hover:text-primary"
//             >
//               Home
//             </NavLink>
//             <NavLink
//               to="/products"
//               onClick={() => setMobileMenuOpen(false)}
//               className="block hover:text-primary"
//             >
//               Shop
//             </NavLink>
//             <NavLink
//               to="/about"
//               onClick={() => setMobileMenuOpen(false)}
//               className="block hover:text-primary"
//             >
//               About Us
//             </NavLink>
//             <NavLink
//               to="/contact"
//               onClick={() => setMobileMenuOpen(false)}
//               className="block hover:text-primary"
//             >
//               Contact Us
//             </NavLink>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default Navbar;




import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FaList,
  FaChevronDown,
  FaChevronUp,
  FaPhoneAlt,
  FaEnvelope,
  FaSearch,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import stanvee_logo from "../assets/stanvee_logo.png";

const Navbar = () => {
  const [showCategories, setShowCategories] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); // ✅ ONLY ADDITION

  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    setSearchQuery,
    searchQuery,
    getCartCount,
    axios,
  } = useAppContext();

  const categories = [
    { name: "Audio Devices", path: "/products/audio" },
    { name: "Dining", path: "/products/dining" },
    { name: "Home Appliances", path: "/products/homeappliances" },
    { name: "Home Essentials", path: "/products/homeessentials" },
    { name: "Kitchen Appliances", path: "/products/kitchenappliances" },
    { name: "Kitchen Essentials", path: "/products/kitchenessentials" },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout", {
        withCredentials: true,
      });

      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  const handleMobileSearchClear = () => {
    setSearchQuery("");
    setMobileSearchOpen(false);
  };

  return (
    <div className="w-full">
      
      {/* TOP BAR */}
      <div className="bg-[#203040] text-gray-200 text-[10px] md:text-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-10 px-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <FaEnvelope className="text-primary text-[12px]" />
              <span>info@stanvee.com</span>
            </div>
            <div className="flex items-center gap-1">
              <FaPhoneAlt className="text-primary text-[12px]" />
              <span>+91 92705 21515</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 font-medium">
            <Link to="/faq">FAQ</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <div className="bg-white sticky top-0 z-50 border-b border-gray-100">
        {/* Upper Navbar */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          {/* Logo */}
          <NavLink
            to="/"
            onClick={() => {
              setSearchQuery("");
              setMobileSearchOpen(false);
              setMobileMenuOpen(false);
              setProfileOpen(false);
            }}
            className="flex items-center"
          >
            <div className="w-32 sm:w-40 h-10 sm:h-12">
              <img
                src={stanvee_logo}
                alt="Stanvee"
                className="w-full h-full object-cover"
              />
            </div>
          </NavLink>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8 text-sm gap-2 px-4 py-2 rounded-full bg-gray-50">
            <input
              value={typeof searchQuery === "string" ? searchQuery : ""}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim()) navigate("/products");
              }}
              className="w-full bg-transparent outline-none"
              placeholder="Search products..."
            />
            <FaSearch className="text-gray-600" />
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4 lg:gap-8">
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="text-lg md:hidden"
            >
              {mobileSearchOpen ? <FaTimes /> : <FaSearch />}
            </button>

            {/* Cart */}
            <div
              onClick={() => navigate("/cart")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span className="hidden lg:block text-sm font-medium">
                My Cart
              </span>
              <div className="relative">
                <img src={assets.nav_cart_icon} alt="cart" className="w-6" />
                <span className="absolute -top-2 -right-3 text-xs bg-primary text-white w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              </div>
            </div>

            {/* User / Login */}
            {!user ? (
              <button
                onClick={() => setShowUserLogin(true)}
                className="px-6 py-2 bg-primary text-white rounded-full text-sm font-medium"
              >
                Login
              </button>
            ) : (
              <div className="relative">
                <img
                  src={assets.profile_icon}
                  className="w-10 cursor-pointer"
                  alt="profile"
                  onClick={() => setProfileOpen(!profileOpen)} // ✅ CLICK
                />

                {profileOpen && (
                  <ul className="absolute right-0 top-10 bg-white border  shadow-lg rounded-md w-32 text-sm z-50">
                    <li
                      onClick={() => {
                        navigate("/my-orders");
                        setProfileOpen(false);
                      }}
                      className="px-3 py-2 hover:bg-primary/10 cursor-pointer"
                    >
                      My Orders
                    </li>
                    <li
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="px-3 py-2 hover:bg-primary/10 text-red-500 cursor-pointer"
                    >
                      Logout
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Input */}
        {mobileSearchOpen && (
          <div className="md:hidden px-4 pb-2 relative w-auto">
            <input
              value={typeof searchQuery === "string" ? searchQuery : ""}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim()) navigate("/products");
              }}
              className="w-full px-3 py-2 border rounded-full outline-none text-sm"
              placeholder="Search products..."
              autoFocus
            />
            <FaTimes
              onClick={handleMobileSearchClear}
              className="absolute right-6 top-1/2 -translate-y-1/2 cursor-pointer"
            />
          </div>
        )}

        {/* Bottom Navbar */}
        <div className="bg-white py-3 px-4 shadow-md flex items-center gap-4 md:gap-10">
          {/* All Categories */}
          <div className="relative">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center rounded-full bg-[#f5f7fa] hover:bg-[#2b8f72] hover:text-white transition pr-5"
            >
              <div className="w-10 h-10 bg-[#2b8f72] rounded-full flex items-center justify-center text-white">
                <FaList />
              </div>
              <span className="px-4 font-medium">All Categories</span>
              {showCategories ? (
                <FaChevronUp size={12} />
              ) : (
                <FaChevronDown size={12} />
              )}
            </button>

            {showCategories && (
              <div className="absolute top-full mt-2 w-64 bg-white shadow-xl rounded-xl overflow-hidden z-50">
                {categories.map((cat) => (
                  <Link
                    key={cat.path}
                    to={cat.path}
                    onClick={() => setShowCategories(false)}
                    className="block px-4 py-3 font-medium hover:bg-gray-100 border-b border-gray-200"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <button
            className="md:hidden text-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <NavLink to="/" className="hover:text-primary">Home</NavLink>
            <NavLink to="/products" className="hover:text-primary">Shop</NavLink>
            <NavLink to="/about" className="hover:text-primary">About Us</NavLink>
            <NavLink to="/contact" className="hover:text-primary">Contact Us</NavLink>
          </div>
        </div>


        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen &&
          (<div className="md:hidden px-4 pb-4 text-sm font-medium mt-3 space-y-2">
            <NavLink to="/"
              onClick={() => setMobileMenuOpen(false)} className="block hover:text-primary" > Home </NavLink>
            <NavLink to="/products" onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-primary" > Shop </NavLink>
            <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className="block hover:text-primary" > About Us </NavLink>
            <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className="block hover:text-primary" > Contact Us </NavLink>
          </div>)}

      </div>

    </div>
  );
};

export default Navbar;
