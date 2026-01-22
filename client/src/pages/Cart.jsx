import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import toast from 'react-hot-toast';
import CartSkeleton from '../components/Skeletons/CartSkeleton';
// import CartSkeleton from '../components/CartSkeleton'; // import skeleton

const Cart = () => {
  const {
    user,
    products,
    currency,
    cartItems,
    removeFromCart,
    getCartCount,
    updateCartItem,
    navigate,
    getCartAmount,
    setCartItems
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [loading, setLoading] = useState(true); // new loading state

  // Build cart array from cartItems and products
  useEffect(() => {
    if (products.length > 0 && cartItems) {
      const tempArray = Object.keys(cartItems).map(key => {
        const product = products.find(p => p._id === key);
        return { ...product, quantity: cartItems[key] };
      });
      setCartArray(tempArray);
      setLoading(false); // stop loading once cart is built
    }
  }, [products, cartItems]);

  // Fetch user addresses
  const getUserAddress = async () => {
    try {
      const { data } = await axios.post('/api/address/get', { userId: user._id });
      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (user) getUserAddress();
  }, [user]);

  // Place order handler
  const placeOrder = async () => {
    if (!selectedAddress) return toast.error("Please select an address");

    setPlacingOrder(true);
    try {
      const endpoint = paymentOption === "COD" ? '/api/order/cod' : '/api/order/stripe';
      const { data } = await axios.post(endpoint, {
        userId: user._id,
        items: cartArray.map(item => ({ product: item._id, quantity: item.quantity })),
        address: selectedAddress._id
      });

      if (data.success) {
        toast.success(data.message);
        if (paymentOption === "COD") {
          setCartItems({});
          navigate('/my-orders');
        } else {
          window.location.replace(data.url);
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  // Show skeleton if loading or cartItems/products not ready
  if (loading || !products.length || !cartItems) {
    return <CartSkeleton />;
  }

  const totalAmount = getCartAmount();
  const tax = totalAmount * 0.02;
  const grandTotal = totalAmount + tax;

  return (
    <div className="flex flex-col md:flex-row mt-16 px-10">
      {/* Cart Items */}
      <div className='flex-1 max-w-4xl'>
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart <span className="text-sm text-primary">{getCartCount()} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Remove</p>
        </div>

        {cartArray.map((product, index) => (
          <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() => { navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0); }}
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded"
              >
                <img className="max-w-full h-full object-cover" src={product.image[0]} alt={product.name} />
              </div>
              <div>
                <p className="hidden md:block font-semibold">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <p>Weight: <span>{product.weight || "N/A"}</span></p>
                  <div className='flex items-center gap-2 mt-1'>
                    <p>Qty:</p>
                    <select
                      onChange={e => updateCartItem(product._id, Number(e.target.value))}
                      value={cartItems[product._id]}
                      className='outline-none'
                    >
                      {Array.from({ length: Math.max(cartItems[product._id], 9) }, (_, i) => (
                        <option key={i} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center">{currency}{product.offerPrice * product.quantity}</p>
            <button onClick={() => removeFromCart(product._id)} className="cursor-pointer mx-auto">
              <img src={assets.remove_icon} alt="remove" className='inline-block w-6 h-6' />
            </button>
          </div>
        ))}

        <button
          onClick={() => { navigate('/products'); scrollTo(0, 0); }}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
        >
          <img src={assets.arrow_right_icon_colored} alt="arrow" className='group-hover:translate-x-1 transition' />
          Continue Shopping
        </button>
      </div>

      {/* Order Summary */}
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70 ml-0 md:ml-8">
        <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6">
          {/* Address */}
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500">
              {selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}` : "No address found"}
            </p>
            <button onClick={() => setShowAddress(!showAddress)} className="text-primary hover:underline cursor-pointer">
              Change
            </button>
            {showAddress && (
              <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full z-10">
                {addresses.map((address, i) => (
                  <p
                    key={i}
                    onClick={() => { setSelectedAddress(address); setShowAddress(false); }}
                    className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {address.street},{address.city},{address.state},{address.country}
                  </p>
                ))}
                <p
                  onClick={() => navigate('/add-address')}
                  className="text-primary text-center cursor-pointer p-2 hover:bg-primary-dull"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          {/* Payment */}
          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        {/* Totals */}
        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span><span>{currency}{totalAmount}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span><span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span><span>{currency}{tax}</span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span><span>{currency}{grandTotal}</span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition disabled:opacity-50"
          disabled={placingOrder}
        >
          {placingOrder ? "Processing..." : paymentOption === 'COD' ? "Place Order" : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
