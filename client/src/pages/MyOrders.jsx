


// import React, { useEffect, useState } from "react";
// import { useAppContext } from "../context/AppContext";
// import MyOrdersSkeleton from "../components/Skeletons/MyOrdersSkeletons";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// const MyOrders = () => {
//   const [myOrders, setMyOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const { currency, user, navigate } = useAppContext();

//   // Order status steps
//   const statusSteps = [
//     "Order Placed",
//     "Packing",
//     "Shipped",
//     "Out for delivery",
//     "Delivered"
//   ];

//   // Fetch user orders
//   const fetchMyOrders = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.post("/api/order/user", { userId: user?._id });
//       if (data.success) setMyOrders(data.orders);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user) fetchMyOrders();
//   }, [user]);

//   return (
//     <div className="mt-16 px-4 md:px-10">
//       {/* Page Title */}
//       <div className="flex flex-col items-center md:items-start mb-8">
//         <p className="text-2xl font-medium uppercase">My Orders</p>
//         <div className="w-16 h-0.5 rounded-full bg-primary mt-1"></div>
//       </div>

//       {/* Loading Skeleton */}
//       {loading &&
//         Array.from({ length: 3 }).map((_, idx) => <MyOrdersSkeleton key={idx} />)}

//       {/* No orders */}
//       {!loading && myOrders.length === 0 && (
//         <p className="text-center text-gray-400 mt-20">No orders found</p>
//       )}

//       {/* Orders */}
//       {!loading &&
//         myOrders.map((order, idx) => {
//           const currentIndex = statusSteps.indexOf(order.status);

//           return (
//             <div
//               key={idx}
//               className="border border-gray-300 rounded-lg mb-8 p-4 max-w-4xl mx-auto shadow-sm"
//             >
//               {/* Order Info */}
//               <div className="text-gray-400 text-sm md:flex md:justify-between md:items-center md:font-medium space-y-1 md:space-y-0">
//                 <p>Order ID: {order._id}</p>
//                 <p>Payment: {order.paymentType}</p>
//                 <p>Total: {currency}{order.totalAmount}</p>
//               </div>

//               {/* Horizontal Status Timeline */}
//               <div className="mt-6 w-full relative">
//                 <div className="flex justify-between items-center relative">
//                   {statusSteps.map((step, stepIdx) => {
//                     const isCompleted = stepIdx < currentIndex;
//                     const isActive = stepIdx === currentIndex;

//                     return (
//                       <div key={stepIdx} className="flex-1 flex flex-col items-center relative z-10">
//                         {/* Circle */}
//                         <div
//                           className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${isCompleted
//                               ? "bg-green-500 border-green-500 text-white"
//                               : isActive
//                                 ? "bg-blue-500 border-blue-500 text-white"
//                                 : "bg-white border-gray-300 text-gray-500"
//                             }`}
//                         >
//                           {isCompleted ? "✓" : stepIdx + 1}
//                         </div>

//                         {/* Label */}
//                         <p className="text-xs mt-2 text-center">{step}</p>

//                         {/* Connector line */}
//                         {stepIdx < statusSteps.length - 1 && (
//                           <div
//                             className={`absolute top-3 left-1/2 w-full h-1 ${stepIdx < currentIndex ? "bg-green-500" : "bg-gray-300"
//                               }`}
//                             style={{ zIndex: 0, transform: "translateX(50%)" }}
//                           ></div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Order Items */}
//               <div className="mt-6">
//                 {order.items.map((item, i) => (
//                   <div
//                     key={i}
//                     className={`bg-white ${order.items.length !== i + 1 && "border-b"} border-gray-200 py-4`}
//                   >
//                     <div className="flex gap-4">
//                       {/* Product Image */}
//                       <div
//                         className="bg-primary/10 p-3 rounded-lg shrink-0 cursor-pointer"
//                         onClick={() =>
//                           navigate(`/products/${item.product?.category?.toLowerCase()}/${item.product?._id}`)
//                         }
//                       >
//                         <img
//                           src={item.product?.image?.[0]}
//                           alt={item.product?.name}
//                           className="w-16 h-16 object-contain"
//                         />
//                       </div>

//                       {/* Product Details */}
//                       <div className="flex-1">
//                         <h2 className="text-base font-medium text-gray-800">{item.product?.name}</h2>
//                         <p className="text-sm text-gray-500">Category: {item.product?.category}</p>
//                         <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity || 1}</p>
//                         {item.couponSelected && item.couponDiscount > 0 && (
//                           <p className="text-green-600 text-sm mt-1">
//                             Coupon applied: -{currency}{item.couponDiscount * (item.quantity || 1)}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     {/* Total Price per Item */}
//                     <div className="flex justify-between items-center mt-3 text-sm">
//                       <div className="text-gray-500 space-y-1">
//                         <p>{new Date(order.createdAt).toLocaleDateString()}</p>
//                       </div>
//                       <p className="text-primary font-medium">
//                         {currency}{(item.finalPrice || 0) * (item.quantity || 1)}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           );
//         })}
//     </div>
//   );
// };

// export default MyOrders;

import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import MyOrdersSkeleton from "../components/Skeletons/MyOrdersSkeletons";
import axios from "axios";
import { toast } from "react-hot-toast";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { currency, user, navigate } = useAppContext();

  // Order status steps
  const statusSteps = [
    "Order Placed",
    "Packing",
    "Shipped",
    "Out for delivery",
    "Delivered"
  ];

  // Fetch user orders
  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/order/user", { userId: user?._id });
      if (data.success) setMyOrders(data.orders);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyOrders();
  }, [user]);

  return (
    <div className="mt-16 px-4 md:px-10">
      {/* Page Title */}
      <div className="flex flex-col items-center md:items-start mb-8">
        <p className="text-2xl font-medium uppercase">My Orders</p>
        <div className="w-16 h-0.5 rounded-full bg-primary mt-1"></div>
      </div>

      {/* Loading Skeleton */}
      {loading &&
        Array.from({ length: 3 }).map((_, idx) => <MyOrdersSkeleton key={idx} />)}

      {/* No orders */}
      {!loading && myOrders.length === 0 && (
        <p className="text-center text-gray-400 mt-20">No orders found</p>
      )}

      {/* Orders */}
      {!loading &&
        myOrders.map((order, idx) => {
          const currentIndex = statusSteps.indexOf(order.status);

          return (
            <div
              key={idx}
              className="border border-gray-300 rounded-lg mb-8 p-4 max-w-4xl mx-auto shadow-sm"
            >
              {/* Order Info */}
              <div className="text-gray-400 text-sm md:flex md:justify-between md:items-center md:font-medium space-y-1 md:space-y-0">
                <p>Order ID: {order._id}</p>
                <p>Payment: {order.paymentType}</p>
                <p>Total: {currency}{order.totalAmount.toFixed(2)}</p>
              </div>

              {/* Horizontal Status Timeline */}
              <div className="mt-6 w-full relative">
                <div className="flex justify-between items-center relative">
                  {statusSteps.map((step, stepIdx) => {
                    const isCompleted = stepIdx < currentIndex;
                    const isActive = stepIdx === currentIndex;

                    return (
                      <div key={stepIdx} className="flex-1 flex flex-col items-center relative z-10">
                        {/* Circle */}
                        <div
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${isCompleted
                              ? "bg-green-500 border-green-500 text-white"
                              : isActive
                                ? "bg-blue-500 border-blue-500 text-white"
                                : "bg-white border-gray-300 text-gray-500"
                            }`}
                        >
                          {isCompleted ? "✓" : stepIdx + 1}
                        </div>

                        {/* Label */}
                        <p className="text-xs mt-2 text-center">{step}</p>

                        {/* Connector line */}
                        {stepIdx < statusSteps.length - 1 && (
                          <div
                            className={`absolute top-3 left-1/2 w-full h-1 ${stepIdx < currentIndex ? "bg-green-500" : "bg-gray-300"
                              }`}
                            style={{ zIndex: 0, transform: "translateX(50%)" }}
                          ></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-6">
                {order.items.map((item, i) => {
                  const quantity = item.quantity || 1;
                  const finalPricePerUnit = item.finalPrice || item.product?.offerPrice || 0;
                  const couponApplied = item.couponSelected ? (item.product?.offerPrice - finalPricePerUnit) * quantity : 0;

                  return (
                    <div
                      key={i}
                      className={`bg-white ${order.items.length !== i + 1 && "border-b"} border-gray-200 py-4`}
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div
                          className="bg-primary/10 p-3 rounded-lg shrink-0 cursor-pointer"
                          onClick={() =>
                            navigate(`/products/${item.product?.category?.toLowerCase()}/${item.product?._id}`)
                          }
                        >
                          <img
                            src={item.product?.image?.[0]}
                            alt={item.product?.name}
                            className="w-16 h-16 object-contain"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <h2 className="text-base font-medium text-gray-800">{item.product?.name}</h2>
                          <p className="text-sm text-gray-500">Category: {item.product?.category}</p>
                          <p className="text-sm text-gray-500 mt-1">Quantity: {quantity}</p>

                          {couponApplied > 0 && (
                            <p className="text-green-600 text-sm mt-1">
                              Coupon applied: -{currency}{couponApplied.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Total Price per Item */}
                      <div className="flex justify-between items-center mt-3 text-sm">
                        <div className="text-gray-500 space-y-1">
                          <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <p className="text-primary font-medium">
                          {currency}{(finalPricePerUnit * quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default MyOrders;