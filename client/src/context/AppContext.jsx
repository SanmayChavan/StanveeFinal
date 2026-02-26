



import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [walletBalance, setWalletBalance] = useState(0);
  const [searchQuery, setSearchQuery] = useState({});

  // Fetch seller status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success);
    } catch {
      setIsSeller(false);
    }
  };

  // Fetch user data
  const fetchUser = async () => {
    try {
      const payload = user?._id ? { userId: user._id } : {};
      const { data } = await axios.post("/api/user/is-auth", payload, { withCredentials: true });

      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
        setWalletBalance(data.user.walletBalance || 0);
      }
    } catch (err) {
      console.log("Auth error:", err.message);
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

  // Add product to cart
  const addToCart = (itemId, couponSelected = false) => {
    if (user) {
      let cartData = structuredClone(cartItems);

      if (cartData[itemId]) {
        // Increment quantity
        cartData[itemId].quantity += 1;
      } else {
        // Initialize with quantity 1
        cartData[itemId] = {
          quantity: 1,
          couponSelected: couponSelected
        };
      }

      setCartItems(cartData);
      toast.success("Added To Cart");
    } else {
      toast.error("Login to add to cart..");
    }
  };

  // Update cart item quantity or coupon status
  // const updateCartItem = (itemId, quantity, couponSelected = null) => {
  //   let cartData = structuredClone(cartItems);

  //   if (!cartData[itemId]) return;

  //   cartData[itemId].quantity = quantity;

  //   // Update coupon if provided
  //   if (couponSelected !== null) {
  //     cartData[itemId].couponSelected = couponSelected;
  //   }

  //   // Remove if quantity becomes 0
  //   if (cartData[itemId].quantity <= 0) {
  //     delete cartData[itemId];
  //   }

  //   setCartItems(cartData);
  // };
  // Accepts productId, quantity, and optional couponSelected toggle
  const updateCartItem = (productId, quantity, couponSelected = null) => {
    const updatedCart = { ...cartItems };

    if (updatedCart[productId]) {
      updatedCart[productId].quantity = quantity;

      if (couponSelected !== null) {
        updatedCart[productId].couponSelected = couponSelected;
      }

      // Remove item if quantity is 0
      if (updatedCart[productId].quantity <= 0) {
        delete updatedCart[productId];
      }
    }

    setCartItems(updatedCart);
  };
  // Remove product from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId].quantity -= 1;
      if (cartData[itemId].quantity <= 0) delete cartData[itemId];
    }
    toast.success("Removed From Cart");
    setCartItems(cartData);
  };

  // Get cart item count
  const getCartCount = () => {
    return Object.values(cartItems).reduce((acc, item) => acc + item.quantity, 0);
  };

  // Get cart total amount
  // Get cart total amount (with coupon discounts)
  // const getCartAmount = () => {
  //   let totalAmount = 0;

  //   for (const itemId in cartItems) {
  //     const product = products.find(p => p._id === itemId);
  //     if (!product) continue;

  //     const quantity = cartItems[itemId]?.quantity || cartItems[itemId] || 1;
  //     const couponSelected = cartItems[itemId]?.couponSelected || false;

  //     let price = product.offerPrice;

  //     if (couponSelected) {
  //       price -= product.couponDiscount || 0; // apply coupon discount
  //     }

  //     totalAmount += price * quantity;
  //   }

  //   return Math.floor(totalAmount * 100) / 100;
  // };
  const getCartAmount = () => {
    let totalAmount = 0;
    let remainingWallet = walletBalance;

    for (const itemId in cartItems) {
      const product = products.find(p => p._id === itemId);
      if (!product) continue;

      const quantity = cartItems[itemId]?.quantity || 1;
      const couponSelected = cartItems[itemId]?.couponSelected || false;

      const basePrice = product.offerPrice || 0;
      const couponValue = product.couponDiscount || 0;

      let finalUnitPrice = basePrice;

      if (couponSelected && remainingWallet > 0 && couponValue > 0) {
        const maxCouponForItem = couponValue * quantity;
        const actualDeduction = Math.min(maxCouponForItem, remainingWallet);

        const perUnitDeduction = actualDeduction / quantity;

        finalUnitPrice = basePrice - perUnitDeduction;

        remainingWallet -= actualDeduction;
      }

      totalAmount += finalUnitPrice * quantity;
    }

    return Math.floor(totalAmount * 100) / 100;
  };

  // Update cart in backend whenever cartItems change
  useEffect(() => {
    const updateCart = async () => {
      try {
        if (!user) return;
        const { data } = await axios.post("/api/cart/update", { userId: user._id, cartItems }, { withCredentials: true });
        if (data.success) {
          setWalletBalance(data.walletBalance || walletBalance);
        } else {
          console.log(data.message);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    updateCart();
  }, [cartItems]);

  // Apply coupon
  const applyCoupon = async (productId) => {
    if (!user) return toast.error("Login to apply coupon");

    try {
      const { data } = await axios.post("/api/cart/apply-coupon", {
        userId: user._id,
        productId
      });

      if (data.success) {
        const product = products.find(p => p._id === productId);
        const discount = Math.min(product.couponDiscount, walletBalance);

        let cartData = structuredClone(cartItems);
        cartData[productId] = {
          ...cartData[productId],
          couponSelected: true,
          finalPrice: product.offerPrice - discount
        };
        setCartItems(cartData);
        setWalletBalance(data.walletBalance);

        toast.success("Coupon applied successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to apply coupon");
    }
  };


  // const placeOrderCOD = async (address) => {
  //   if (!user) {
  //     toast.error("Login to place order");
  //     return;
  //   }

  //   // Prepare cart items for order
  //   const items = Object.keys(cartItems).map(id => ({
  //     product: id,
  //     quantity: cartItems[id].quantity,
  //     finalPrice: cartItems[id].finalPrice,
  //     couponSelected: cartItems[id].couponSelected || false
  //   }));

  //   try {
  //     const { data } = await axios.post("/api/order/cod", {
  //       userId: user._id,
  //       items,
  //       address
  //     });

  //     if (data.success) {
  //       toast.success("Order placed successfully!");

  //       // Clear cart
  //       setCartItems({});

  //       // ✅ Update wallet instantly (independent of user state)
  //       setWalletBalance(data.userWalletBalance || 0);

  //       // Optional: update user object if needed
  //       setUser(prev => ({ ...prev, walletBalance: data.userWalletBalance || 0 }));
  //     } else {
  //       toast.error(data.message);
  //     }
  //   } catch (err) {
  //     console.log(err.message);
  //     toast.error("Failed to place order");
  //   }
  // };
  // const placeOrderCOD = async (address) => {
  //   if (!user) return toast.error("Login to place order");

  //   // Prepare cart items for order with actual finalPrice
  //   const items = Object.keys(cartItems).map(id => {
  //     const product = products.find(p => p._id === id);
  //     if (!product) return null;

  //     const quantity = cartItems[id].quantity || 1;
  //     const couponSelected = cartItems[id].couponSelected || false;
  //     const couponValue = couponSelected ? Math.min(product.couponDiscount, walletBalance) : 0;

  //     // Final price per unit after wallet/coupon deduction
  //     const finalPrice = product.offerPrice - couponValue;

  //     return {
  //       product: id,
  //       quantity,
  //       finalPrice,
  //       couponSelected
  //     };
  //   }).filter(Boolean);

  //   try {
  //     const { data } = await axios.post("/api/order/cod", {
  //       userId: user._id,
  //       items,
  //       address
  //     });

  //     if (data.success) {
  //       toast.success("Order placed successfully!");

  //       // Clear cart
  //       setCartItems({});

  //       // Update wallet instantly
  //       setWalletBalance(data.userWalletBalance || 0);

  //       // Update user object
  //       setUser(prev => ({ ...prev, walletBalance: data.userWalletBalance || 0 }));

  //       // Optional: refresh orders list if MyOrders page is mounted
  //       await syncUser();
  //     } else {
  //       toast.error(data.message);
  //     }
  //   } catch (err) {
  //     console.log(err.message);
  //     toast.error("Failed to place order");
  //   }
  // };
  const placeOrderCOD = async (address) => {
    if (!user) {
      toast.error("Login to place order");
      return;
    }

    const items = Object.keys(cartItems).map(id => ({
      product: id,
      quantity: cartItems[id].quantity,
      finalPrice: cartItems[id].finalPrice,
      couponSelected: cartItems[id].couponSelected || false
    }));

    try {
      const { data } = await axios.post("/api/order/cod", {
        userId: user._id,
        items,
        address
      });

      if (data.success) {
        toast.success("Order placed successfully!");

        // Clear cart locally
        setCartItems({});

        // Optional: clear search query if any
        setSearchQuery({});

        // ✅ Navigate to MyOrders page after placing order
        // This will refresh the page and fetch wallet from backend
        navigate("/my-orders");

        // If you want to force reload to make sure wallet is synced:
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to place order");
      }
    } catch (err) {
      console.error("Place COD order error:", err.message);
      toast.error("Failed to place order");
    }
  };


  // dispatcher
  // 1. Add Dispatcher State
  const [isDispatcher, setIsDispatcher] = useState(false);
  // 2. Add Dispatcher Auth Check Function
  // Inside AppContext.jsx
  const fetchDispatcher = async () => {
    try {
      // Added /api prefix to match your backend router
      const { data } = await axios.get("/api/dispatcher/auth");
      if (data.success) {
        setIsDispatcher(true);
      }
    } catch (error) {
      setIsDispatcher(false);
    }
  };

  // inside AppContextProvider
  const syncUser = async () => {
    try {
      const payload = user?._id ? { userId: user._id } : {};
      const { data } = await axios.post("/api/user/is-auth", payload, { withCredentials: true });

      if (data.success) {
        setUser(data.user);                          // Full user object
        setCartItems(data.user.cartItems || {});     // Cart items
        setWalletBalance(data.user.walletBalance || 0); // Wallet
      }
    } catch (err) {
      console.log("Auth error:", err.message);
    }
  };



  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
    fetchDispatcher();
    syncUser()
  }, []);

  const value = {
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
    addToCart,
    updateCartItem,
    removeFromCart,
    getCartCount,
    getCartAmount,
    searchQuery,
    setSearchQuery,
    axios,
    fetchSeller,
    fetchProducts,
    setCartItems,
    walletBalance,
    setWalletBalance,
    applyCoupon,
    placeOrderCOD,


    // dispatcher
    isDispatcher,       // <--- Added to value
    setIsDispatcher,    // <--- Added to value
    fetchDispatcher,

    syncUser
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);