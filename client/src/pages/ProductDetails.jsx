

// import React, { useEffect, useState, useMemo } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { useAppContext } from '../context/AppContext';
// import { assets } from '../assets/assets';
// import ProductCard from '../components/ProductCard';

// const ProductDetails = () => {
//   const {
//     products,
//     navigate,
//     currency,
//     user,
//     setShowUserLogin,
//     cartItems,
//     setCartItems,
//   } = useAppContext();
//   const { id } = useParams();

//   // --- State ---
//   const [thumbnail, setThumbnail] = useState(null);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [selectedCoupon, setSelectedCoupon] = useState(null);

//   // --- Current Product ---
//   const product = useMemo(() => products.find(item => item._id === id), [products, id]);

//   // --- Scroll to top ---
//   useEffect(() => window.scrollTo(0, 0), [id]);

//   // --- Set default thumbnail ---
//   useEffect(() => {
//     if (product?.image?.length) setThumbnail(product.image[0]);
//   }, [product]);

//   // --- Related products ---
//   useEffect(() => {
//     if (!product || products.length === 0) return;
//     const related = products
//       .filter(p => p.category === product.category && p._id !== product._id && p.inStock)
//       .slice(0, 5);
//     setRelatedProducts(related);
//   }, [products, product]);

//   if (!product) return null;

//   // --- Final price calculation including wallet deduction ---
//   const finalPrice = useMemo(() => {
//     if (!product) return 0;
//     const couponValue = selectedCoupon === "COUPON" ? product?.couponDiscount || 0 : 0;
//     const walletDeduction = user ? Math.min(user.walletBalance, couponValue) : 0;
//     return Math.max(0, product.offerPrice - walletDeduction);
//   }, [product, selectedCoupon, user?.walletBalance]);

//   // --- Wallet deduction for display ---
//   const walletDeduction = useMemo(() => {
//     if (!product || !user) return 0;
//     const couponValue = selectedCoupon === "COUPON" ? product?.couponDiscount || 0 : 0;
//     return Math.min(user.walletBalance, couponValue);
//   }, [product, selectedCoupon, user?.walletBalance]);

//   // --- Add to cart with coupon info ---
//   const handleAddToCart = () => {
//     if (!user) return setShowUserLogin(true);

//     const updatedCart = structuredClone(cartItems);

//     if (updatedCart[product._id]) {
//       updatedCart[product._id].quantity = (updatedCart[product._id]?.quantity || 0) + 1;
//       updatedCart[product._id].couponSelected = selectedCoupon === "COUPON";
//     } else {
//       updatedCart[product._id] = {
//         quantity: 1,
//         couponSelected: selectedCoupon === "COUPON",
//       };
//     }

//     setCartItems(updatedCart);
//   };

//   // --- Get cart quantity safely ---
//   const cartQuantity = cartItems[product._id]?.quantity || 0;

//   return (
//     <div className="mt-12 px-4 md:px-16">

//       {/* Breadcrumb */}
//       <p className="text-sm">
//         <Link to="/">Home</Link> / <Link to="/products">Products</Link> /{' '}
//         <Link to={`/products/${product.category.toLowerCase()}`}>{product.category}</Link> /{' '}
//         <span className="text-primary">{product.name}</span>
//       </p>

//       {/* Product Section */}
//       <div className="flex flex-col md:flex-row gap-16 mt-4">

//         {/* Images */}
//         <div className="flex gap-6">
//           {/* Thumbnails */}
//           <div className="flex flex-col gap-3">
//             {product.image?.map((img, i) => (
//               <button
//                 key={i}
//                 onClick={() => setThumbnail(img)}
//                 className={`border rounded overflow-hidden w-14 md:w-20 h-20 ${thumbnail === img ? 'border-primary' : 'border-gray-300'}`}
//               >
//                 <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
//               </button>
//             ))}
//           </div>

//           {/* Main Image */}
//           <div className="border border-gray-300 rounded overflow-hidden w-[250px] h-[300px] md:w-[400px] md:h-[400px] flex-shrink-0">
//             {thumbnail && <img src={thumbnail} alt={product.name} className="w-full h-full object-contain" />}
//           </div>
//         </div>

//         {/* Product Info */}
//         <div className="text-sm w-full md:w-1/2">
//           <h1 className="text-3xl font-medium">{product.name}</h1>

//           {/* Rating */}
//           <div className="flex items-center gap-0.5 mt-1">
//             {Array(5).fill('').map((_, i) => (
//               <img key={i} src={i < 4 ? assets.star_icon : assets.star_dull_icon} className="md:w-4 w-3.5" alt="rating star" />
//             ))}
//             <p className="text-base ml-2">(4)</p>
//           </div>

//           {/* Price Section */}
//           <div className="mt-6">
//             <p className="text-gray-500/70 line-through">MRP: {currency}{product.price}</p>

//             {selectedCoupon === "COUPON" ? (
//               <>
//                 <p className="text-gray-500/70 line-through">Offer Price: {currency}{product.offerPrice}</p>
//                 <p className="text-2xl font-medium mt-1">Final Price: {currency}{finalPrice}</p>
//                 {walletDeduction > 0 && (
//                   <p className="text-green-600 text-sm mt-1">Wallet applied: {currency}{walletDeduction}</p>
//                 )}
//               </>
//             ) : (
//               <p className="text-2xl font-medium">Offer Price: {currency}{product.offerPrice}</p>
//             )}

//             {selectedCoupon === "COUPON" && product.couponDiscount > 0 && (
//               <p className="text-green-600 text-sm mt-1">You saved {currency}{product.couponDiscount}</p>
//             )}

//             <span className="text-gray-500/70">(inclusive of all taxes)</span>
//           </div>

//           {/* Coupon Dropdown */}
//           <div className="mt-6">
//             <p className="text-base font-medium">Apply Coupon</p>
//             <select
//               value={selectedCoupon || ""}
//               onChange={e => setSelectedCoupon(e.target.value || null)}
//               className="mt-2 border border-gray-300 rounded px-3 py-2 w-full"
//             >
//               <option value="">Select Coupon</option>
//               <option value="COUPON">Save {currency}{product.couponDiscount || 0}</option>
//             </select>
//           </div>

//           {/* Description */}
//           <p className="text-base font-medium mt-6">About Product</p>
//           <ul className="list-disc ml-4 text-gray-500/70">
//             {product.description?.map((desc, i) => <li key={i}>{desc}</li>)}
//           </ul>

//           {/* Actions */}
//           <div className="flex items-center mt-10 gap-4 text-base">
//             <button
//               onClick={handleAddToCart}
//               className="w-full py-3.5 font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
//             >
//               Add to Cart {cartQuantity > 0 && `(${cartQuantity})`}
//             </button>
//             <button
//               onClick={() => { handleAddToCart(); navigate('/cart'); }}
//               className="w-full py-3.5 font-medium bg-primary text-white hover:bg-primary-dull transition"
//             >
//               Buy now
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Related Products */}
//       <div className="flex flex-col items-center mt-20">
//         <div className="flex flex-col items-center w-max">
//           <p className="text-3xl font-medium">Related products</p>
//           <div className="w-20 h-0.5 rounded-full bg-primary mt-2"></div>
//         </div>

//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6 w-full">
//           {relatedProducts.map(item => <ProductCard key={item._id} product={item} />)}
//         </div>

//         <button
//           onClick={() => { navigate('/products'); window.scrollTo(0, 0); }}
//           className="mx-auto px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition"
//         >
//           See more
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;



import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const {
    products,
    navigate,
    currency,
    user,
    setShowUserLogin,
    cartItems,
    setCartItems,
  } = useAppContext();

  const { id } = useParams();

  // --- State ---
  const [thumbnail, setThumbnail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  // --- Current Product ---
  const product = useMemo(
    () => products.find(item => item._id === id),
    [products, id]
  );

  // --- Scroll to top ---
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // --- Set default thumbnail ---
  useEffect(() => {
    if (product?.image?.length) {
      setThumbnail(product.image[0]);
    }
  }, [product]);

  // --- Related products ---
  useEffect(() => {
    if (!product || products.length === 0) return;

    const related = products
      .filter(
        p =>
          p.category === product.category &&
          p._id !== product._id &&
          p.inStock
      )
      .slice(0, 5);

    setRelatedProducts(related);
  }, [products, product]);

  if (!product) return null;

  // --- Final price calculation ---
  const finalPrice = useMemo(() => {
    if (!product) return 0;

    const couponValue =
      selectedCoupon === "COUPON"
        ? product?.couponDiscount || 0
        : 0;

    const walletDeduction = user
      ? Math.min(user.walletBalance, couponValue)
      : 0;

    return Math.max(0, product.offerPrice - walletDeduction);
  }, [product, selectedCoupon, user?.walletBalance]);

  // --- Wallet deduction for display ---
  const walletDeduction = useMemo(() => {
    if (!product || !user) return 0;

    const couponValue =
      selectedCoupon === "COUPON"
        ? product?.couponDiscount || 0
        : 0;

    return Math.min(user.walletBalance, couponValue);
  }, [product, selectedCoupon, user?.walletBalance]);

  // --- Add to cart ---
  const handleAddToCart = () => {
    if (!user) return setShowUserLogin(true);

    const updatedCart = structuredClone(cartItems);

    if (updatedCart[product._id]) {
      updatedCart[product._id].quantity =
        (updatedCart[product._id]?.quantity || 0) + 1;

      updatedCart[product._id].couponSelected =
        selectedCoupon === "COUPON";
    } else {
      updatedCart[product._id] = {
        quantity: 1,
        couponSelected: selectedCoupon === "COUPON",
      };
    }

    setCartItems(updatedCart);
  };

  const cartQuantity = cartItems[product._id]?.quantity || 0;

  return (
    <div className="mt-12 px-4 md:px-16">

      {/* Breadcrumb */}
      <p className="text-sm">
        <Link to="/">Home</Link> /{" "}
        <Link to="/products">Products</Link> /{" "}
        <Link to={`/products/${product.category.toLowerCase()}`}>
          {product.category}
        </Link>{" "}
        / <span className="text-primary">{product.name}</span>
      </p>

      {/* Product Section */}
      <div className="flex flex-col md:flex-row gap-16 mt-4">

        {/* Images */}
        <div className="flex gap-6">
          <div className="flex flex-col gap-3">
            {product.image?.map((img, i) => (
              <button
                key={i}
                onClick={() => setThumbnail(img)}
                className={`border rounded overflow-hidden w-14 md:w-20 h-20 ${
                  thumbnail === img
                    ? "border-primary"
                    : "border-gray-300"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="border border-gray-300 rounded overflow-hidden w-[250px] h-[300px] md:w-[400px] md:h-[400px] flex-shrink-0">
            {thumbnail && (
              <img
                src={thumbnail}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl font-medium">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-0.5 mt-1">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  src={
                    i < 4
                      ? assets.star_icon
                      : assets.star_dull_icon
                  }
                  className="md:w-4 w-3.5"
                  alt="rating star"
                />
              ))}
            <p className="text-base ml-2">(4)</p>
          </div>

          {/* Price Section */}
          <div className="mt-6">
            <p className="text-gray-500/70 line-through">
              MRP: {currency}{product.price}
            </p>

            {selectedCoupon === "COUPON" ? (
              <>
                <p className="text-gray-500/70 line-through">
                  Offer Price: {currency}{product.offerPrice}
                </p>
                <p className="text-2xl font-medium mt-1">
                  Final Price: {currency}{finalPrice}
                </p>

                {walletDeduction > 0 && (
                  <p className="text-green-600 text-sm mt-1">
                    Wallet applied: ₹{walletDeduction}
                  </p>
                )}
              </>
            ) : (
              <p className="text-2xl font-medium">
                Offer Price: {currency}{product.offerPrice}
              </p>
            )}

            {/* Available Coupon Price */}
            {product.couponDiscount > 0 && (
              <p className="text-green-600 text-sm mt-1">
                Available Coupon Price: ₹{product.couponDiscount}
              </p>
            )}
          </div>

          {/* Coupon Dropdown */}
          <div className="mt-6">
            <p className="text-base font-medium">
              Apply Coupon
            </p>

            <select
              value={selectedCoupon || ""}
              onChange={e =>
                setSelectedCoupon(
                  e.target.value || null
                )
              }
              className="mt-2 border border-gray-300 rounded px-3 py-2 w-full"
            >
              <option value="">
                Select Coupon
              </option>
              <option value="COUPON">
                Save ₹{product.couponDiscount || 0}
              </option>
            </select>
          </div>

          {/* Description */}
          <p className="text-base font-medium mt-6">
            About Product
          </p>

          <ul className="list-disc ml-4 text-gray-500/70">
            {product.description?.map(
              (desc, i) => (
                <li key={i}>{desc}</li>
              )
            )}
          </ul>

          {/* Actions */}
          <div className="flex items-center mt-10 gap-4 text-base">
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
            >
              Add to Cart{" "}
              {cartQuantity > 0 &&
                `(${cartQuantity})`}
            </button>

            <button
              onClick={() => {
                handleAddToCart();
                navigate("/cart");
              }}
              className="w-full py-3.5 font-medium bg-primary text-white hover:bg-primary-dull transition"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="flex flex-col items-center mt-20">
        <div className="flex flex-col items-center w-max">
          <p className="text-3xl font-medium">
            Related products
          </p>
          <div className="w-20 h-0.5 rounded-full bg-primary mt-2"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6 w-full">
          {relatedProducts.map(item => (
            <ProductCard
              key={item._id}
              product={item}
            />
          ))}
        </div>

        <button
          onClick={() => {
            navigate("/products");
            window.scrollTo(0, 0);
          }}
          className="mx-auto px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition"
        >
          See more
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;