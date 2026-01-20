// import { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import axios from "axios";

// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// export const AppContext = createContext();

// export const AppContextProvider = ({ children }) => {
//   const currency = import.meta.env.VITE_CURRENCY;

//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [isSeller, setIsSeller] = useState(false);
//   const [showUserLogin, setShowUserLogin] = useState(false);
//   const [products, setProducts] = useState([]);
//   const [cartItems, setCartItems] = useState({});
//   const [searchQuery, setSearchQuery] = useState({});

//   // fetch seller status
//   const fetchSeller = async () => {
//     try {
//       const { data } = await axios.get("/api/seller/is-auth");
//       if (data.success) {
//         setIsSeller(true);
//       } else {
//         setIsSeller(false);
//       }
//     } catch (err) {
//       setIsSeller(false);
//     }
//   };

//   //fetch user auth status, user data and cart items
//   const fetchUser = async (req, res) => {
//     try {
//       const payload = user?._id ? { userId: user._id } : {};
//       const { data } = await axios.post("/api/user/is-auth", payload, {
//         withCredentials: true,
//       });
//       if (data.success) {
//         setUser(data.user);
//         setCartItems(data.user.cartItems);
//       }
//     } catch (err) {
//       console.log("Auth error:", err.message);
//     }
//   };

//   // fetch all products
//   const fetchProducts = async () => {
//     try {
//       const { data } = await axios.get("/api/product/list");
//       if (data.success) {
//         setProducts(data.products);
//       } else {
//         console.log(data.message);
//       }
//     } catch (err) {
//       console.log(err.message);
//       console.log(err.message);
//     }
//   };

//   // add product to cart
//   const addToCart = (itemId) => {
//     if (user) {
//       let cartData = structuredClone(cartItems);

//       if (cartData[itemId]) {
//         cartData[itemId] += 1;
//       } else {
//         cartData[itemId] = 1;
//       }

//       setCartItems(cartData);
//       toast.success("Added To Cart");
//     }else{
//       toast.error("Login to add to cart..");
//     }
//   };

//   // update cart item quantity
//   const updateCartItem = (itemId, quantity) => {
//     let cartData = structuredClone(cartItems);

//     cartData[itemId] = quantity;
//     setCartItems(cartData);
//   };

//   // Remove product from cart
//   const removeFromCart = (itemId) => {
//     let cartData = structuredClone(cartItems);

//     if (cartData[itemId]) {
//       cartData[itemId] -= 1;
//       if (cartData[itemId] === 0) {
//         delete cartData[itemId];
//       }
//     }

//     toast.success("Removed From Cart");
//     setCartItems(cartData);
//   };

//   // Get cart item count
//   const getCartCount = () => {
//     let totalCount = 0;
//     for (const item in cartItems) {
//       totalCount += cartItems[item];
//     }
//     return totalCount;
//   };

//   // Get cart total amount
//   const getCartAmount = () => {
//     let totalAmount = 0;
//     for (const items in cartItems) {
//       let itemInfo = products.find((product) => product._id === items);
//       if (cartItems[items] > 0) {
//         totalAmount += cartItems[items] * itemInfo.offerPrice;
//       }
//     }
//     return Math.floor(totalAmount * 100) / 100;
//   };

//   useEffect(() => {
//     fetchUser();
//     fetchSeller();
//     fetchProducts();
//   }, []);

//   // update database cart items
//   useEffect(() => {
//     const updateCart = async () => {
//       try {
//         const { data } = await axios.post(
//           "/api/cart/update",
//           { cartItems },
//           { withCredentials: true }
//         );
//         if (!data.success) {
//           console.log(data.message);
//         }
//       } catch (err) {
//         console.log(err.message);
//       }
//     };
//     if (user) {
//       updateCart();
//     }
//   }, [cartItems]);

//   const value = {
//     navigate,
//     user,
//     setUser,
//     isSeller,
//     setIsSeller,
//     showUserLogin,
//     setShowUserLogin,
//     products,
//     currency,
//     cartItems,
//     addToCart,
//     updateCartItem,
//     removeFromCart,
//     searchQuery,
//     getCartCount,
//     getCartAmount,
//     setSearchQuery,
//     axios,
//     fetchSeller,
//     fetchProducts,
//     setCartItems,
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };

// export const useAppContext = () => {
//   return useContext(AppContext);
// };

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// Axios global defaults
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL; // e.g., https://stanveefinal-backend.onrender.com
axios.defaults.withCredentials = true; // send cookies

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

  const currency = import.meta.env.VITE_CURRENCY;

  // Login / Register user
  const loginUser = async (email, password) => {
    const { data } = await axios.post("/api/user/login", { email, password });
    if (data.success) setUser(data.user);
    return data;
  };

  const registerUser = async (name, email, password) => {
    const { data } = await axios.post("/api/user/register", { name, email, password });
    if (data.success) setUser(data.user);
    return data;
  };

  // Fetch user auth status
  const fetchUser = async () => {
    try {
      const { data } = await axios.post("/api/user/is-auth", {}, { withCredentials: true });
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems);
      }
    } catch (err) {
      console.log("Auth error:", err.message);
    }
  };

  // Fetch seller auth
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success);
    } catch {
      setIsSeller(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.log(err.message);
    }
  };

  // Cart functions
  const addToCart = (itemId) => {
    if (!user) return toast.error("Login to add to cart");
    const newCart = { ...cartItems };
    newCart[itemId] = (newCart[itemId] || 0) + 1;
    setCartItems(newCart);
    toast.success("Added to cart");
  };

  const updateCartItem = (itemId, quantity) => {
    const newCart = { ...cartItems };
    newCart[itemId] = quantity;
    setCartItems(newCart);
  };

  const removeFromCart = (itemId) => {
    const newCart = { ...cartItems };
    if (newCart[itemId] > 1) {
      newCart[itemId] -= 1;
    } else {
      delete newCart[itemId];
    }
    setCartItems(newCart);
    toast.success("Removed from cart");
  };

  const getCartCount = () => Object.values(cartItems).reduce((a, b) => a + b, 0);

  const getCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const product = products.find(p => p._id === id);
      if (product) total += product.offerPrice * cartItems[id];
    }
    return Math.round(total * 100) / 100;
  };

  // Sync cart to backend
  useEffect(() => {
    if (!user) return;
    const updateCart = async () => {
      try {
        await axios.post("/api/cart/update", { cartItems });
      } catch (err) {
        console.log(err.message);
      }
    };
    updateCart();
  }, [cartItems]);

  // Fetch initial data
  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  return (
    <AppContext.Provider
      value={{
        navigate,
        user,
        setUser,
        isSeller,
        setIsSeller,
        showUserLogin,
        setShowUserLogin,
        products,
        currency,
        cartItems,
        setCartItems,
        addToCart,
        updateCartItem,
        removeFromCart,
        searchQuery,
        setSearchQuery,
        getCartCount,
        getCartAmount,
        loginUser,
        registerUser,
        axios
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);


