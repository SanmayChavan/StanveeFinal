



// import React, { useEffect, useState } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import { toast } from 'react-hot-toast';
// import axios from 'axios';

// const statusOptions = [
//   "Order Placed",
//   "Packing",
//   "Shipped",
//   "Out for delivery",
//   "Delivered"
// ];

// const DispatcherPage = () => {
//   const { currency, isDispatcher } = useAppContext();
//   const [orders, setOrders] = useState([]);

//   // Fetch all orders
//   const fetchAllOrders = async () => {
//     try {
//       const { data } = await axios.get('/api/dispatcher/orders', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('dispatcherToken')}`,
//         },
//       });
//       if (data.success) {
//         setOrders(data.orders || []);
//       }
//     } catch (err) {
//       toast.error("Failed to load orders");
//     }
//   };

//   // Update order status
//   const updateStatus = async (orderId, status) => {
//     try {
//       const { data } = await axios.post(
//         '/api/dispatcher/update-status',
//         { orderId, status },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('dispatcherToken')}`,
//           },
//         }
//       );

//       if (data.success) {
//         toast.success(data.message);
//         setOrders((prev) =>
//           prev.map((o) => (o._id === orderId ? { ...o, status } : o))
//         );
//       }
//     } catch (err) {
//       toast.error("Failed to update status");
//     }
//   };

//   useEffect(() => {
//     if (isDispatcher) fetchAllOrders();
//   }, [isDispatcher]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-6xl mx-auto p-5 sm:p-8">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-semibold text-gray-700">
//             All Delivery Orders
//           </h2>
//           <span className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
//             Total: {orders.length}
//           </span>
//         </div>

//         {/* Orders List */}
//         <div className="flex flex-col gap-6">
//           {orders.length > 0 ? (
//             orders.map((order) => (
//               <div
//                 key={order._id}
//                 className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:shadow-md transition"
//               >
//                 {/* Customer Info */}
//                 <div className="flex flex-col sm:flex-row justify-between mb-4">
//                   <div>
//                     <p className="font-semibold text-gray-800">
//                       {order.address.firstName} {order.address.lastName}
//                     </p>
//                     <p className="text-sm text-gray-500">{order.address.street}, {order.address.city}</p>
//                     <p className="text-xs text-gray-400">{order.address.phone}</p>
//                   </div>
//                   <div className="mt-2 sm:mt-0 text-right">
//                     <p className="text-lg font-bold text-gray-700">{currency}{order.amount}</p>
//                     <p className="text-xs text-gray-500">{order.paymentType} {order.isPaid ? "(Paid)" : "(Unpaid)"}</p>
//                   </div>
//                 </div>

//                 {/* Items */}
//                 <div className="flex flex-col gap-3 mb-4">
//                   {order.items.map((item) => (
//                     <div key={item._id} className="flex items-center gap-4 border-b border-gray-100 pb-3">
//                       <img
//                         src={item.product?.image?.[0] || item.image?.[0]}
//                         alt={item.product?.name || item.name}
//                         className="w-16 h-16 object-contain rounded"
//                       />
//                       <div className="flex-1">
//                         <p className="font-medium text-gray-800">{item.product?.name || item.name}</p>
//                         <p className="text-xs text-gray-500">{item.product?.category}</p>
//                         <p className="text-xs text-gray-500 mt-1">Quantity: {item.quantity}</p>
//                         <p className="text-xs text-gray-500">Price: {currency}{item.finalPrice}</p>
//                         {item.product?.couponDiscount > 0 && (
//                           <p className="text-green-600 text-xs">Coupon: -{currency}{item.product.couponDiscount}</p>
//                         )}
//                       </div>
//                       <p className="font-semibold">{currency}{item.finalPrice * item.quantity}</p>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Status Dropdown */}
//                 <div className="flex justify-end mt-3">
//                   <select
//                     className="p-2 bg-gray-50 border border-gray-300 rounded text-sm"
//                     value={order.status}
//                     onChange={(e) => updateStatus(order._id, e.target.value)}
//                   >
//                     {statusOptions.map((status) => (
//                       <option key={status} value={status}>{status}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300 text-gray-400">
//               No orders available for dispatch.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DispatcherPage;


// import React, { useEffect, useState } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import { toast } from 'react-hot-toast';
// import axios from 'axios';

// const DispatcherPage = () => {
//   const { currency, isDispatcher } = useAppContext();
//   const [orders, setOrders] = useState([]);

//   // Fetch all orders
//   const fetchAllOrders = async () => {
//     try {
//       const { data } = await axios.get('/api/dispatcher/orders', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('dispatcherToken')}`,
//         },
//       });
//       if (data.success) {
//         setOrders([...data.orders]);
//       }
//     } catch (err) {
//       toast.error("Failed to load orders");
//     }
//   };

//   // Update order status
//   const updateStatus = async (orderId, status) => {
//     try {
//       const { data } = await axios.post(
//         '/api/dispatcher/update-status',
//         { orderId, status },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('dispatcherToken')}`,
//           },
//         }
//       );

//       if (data.success) {
//         toast.success(data.message);
//         // Update orders locally
//         setOrders(prev =>
//           prev.map(o => (o._id === orderId ? { ...o, status } : o))
//         );
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update status");
//     }
//   };

//   useEffect(() => {
//     if (isDispatcher) fetchAllOrders();
//   }, [isDispatcher]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-6xl mx-auto p-5 sm:p-8">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-semibold text-gray-700">
//             All Delivery Orders
//           </h2>
//           <span className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
//             Total: {orders.length}
//           </span>
//         </div>

//         {/* Orders List */}
//         <div className="flex flex-col gap-4">
//           {orders.length > 0 ? (
//             orders.map((order, idx) => (
//               <div
//                 key={idx}
//                 className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] items-center gap-4 p-5 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
//               >
//                 {/* Icon */}
//                 <div className="hidden sm:block">
//                   <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
//                     📦
//                   </div>
//                 </div>

//                 {/* Customer Details */}
//                 <div>
//                   <p className="font-semibold text-gray-800">
//                     {order.address.firstName} {order.address.lastName}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     {order.address.street}, {order.address.city}
//                   </p>
//                   <p className="text-xs text-gray-400">{order.address.phone}</p>
//                 </div>

//                 {/* Items Info */}
//                 <div className="space-y-1">
//                   {order.items.map((item, i) => (
//                     <div key={i} className="flex gap-2 items-center">
//                       <img
//                         src={item.image?.[0]}
//                         alt={item.name}
//                         className="w-10 h-10 object-contain rounded"
//                       />
//                       <div>
//                         <p className="text-sm font-medium">{item.name}</p>
//                         <p className="text-xs text-gray-500">
//                           Qty: {item.quantity} × {currency}{item.finalPrice}
//                         </p>
//                         <p className="text-xs text-green-600">
//                           Total: {currency}{item.finalPriceTotal}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Amount */}
//                 <p className="text-lg font-bold text-gray-700">{currency}{order.amount}</p>

//                 {/* Payment */}
//                 <p className="text-sm text-gray-500">{order.paymentType}</p>

//                 {/* Status Dropdown */}
//                 <div className="flex flex-col items-start sm:items-end">
//                   <select
//                     className="p-2 bg-gray-50 border border-gray-300 text-sm rounded focus:ring-blue-500 focus:border-blue-500"
//                     value={order.status}
//                     onChange={(e) => updateStatus(order._id, e.target.value)}
//                   >
//                     <option value="Order Placed">Order Placed</option>
//                     <option value="Packing">Packing</option>
//                     <option value="Shipped">Shipped</option>
//                     <option value="Out for delivery">Out for delivery</option>
//                     <option value="Delivered">Delivered</option>
//                   </select>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300 text-gray-400">
//               No orders available for dispatch.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DispatcherPage;


// import React, { useEffect, useState } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import { toast } from 'react-hot-toast';
// import axios from 'axios';

// const statusOptions = [
//   "Order Placed",
//   "Packing",
//   "Shipped",
//   "Out for delivery",
//   "Delivered"
// ];

// const DispatcherPage = () => {
//   const { currency, isDispatcher } = useAppContext();
//   const [orders, setOrders] = useState([]);

//   // Fetch all orders
//   const fetchAllOrders = async () => {
//     try {
//       const { data } = await axios.get('/api/dispatcher/orders', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('dispatcherToken')}`,
//         },
//       });
//       if (data.success) {
//         setOrders([...data.orders]);
//       }
//     } catch (err) {
//       toast.error("Failed to load orders");
//     }
//   };

//   // Update order status
//   const updateStatus = async (orderId, status) => {
//     try {
//       const { data } = await axios.post(
//         '/api/dispatcher/update-status',
//         { orderId, status },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('dispatcherToken')}`,
//           },
//         }
//       );

//       if (data.success) {
//         toast.success(data.message);
//         // Update orders locally
//         setOrders(prev =>
//           prev.map(o => (o._id === orderId ? { ...o, status } : o))
//         );
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update status");
//     }
//   };

//   useEffect(() => {
//     if (isDispatcher) fetchAllOrders();
//   }, [isDispatcher]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-6xl mx-auto p-5 sm:p-8">

//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-semibold text-gray-700">
//             All Delivery Orders
//           </h2>
//           <span className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
//             Total: {orders.length}
//           </span>
//         </div>

//         {/* Orders List */}
//         <div className="flex flex-col gap-4">
//           {orders.length > 0 ? (
//             orders.map((order, idx) => (
//               <div
//                 key={order._id}
//                 className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] items-center gap-4 p-5 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
//               >
//                 {/* Icon */}
//                 <div className="hidden sm:block">
//                   <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
//                     📦
//                   </div>
//                 </div>

//                 {/* Customer Details */}
//                 <div>
//                   <p className="font-semibold text-gray-800">
//                     {order.address?.firstName} {order.address?.lastName}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     {order.address?.street}, {order.address?.city}
//                   </p>
//                   <p className="text-xs text-gray-400">{order.address?.phone}</p>
//                 </div>

//                 {/* Items Info */}
//                 <div className="space-y-2">
//                   {order.items?.map((item, i) => (
//                     <div key={i} className="flex gap-2 items-center border-b border-gray-100 pb-1 last:border-0 last:pb-0">
//                       <img
//                         src={item.image?.[0]}
//                         alt={item.name}
//                         className="w-10 h-10 object-contain rounded"
//                       />
//                       <div className="flex flex-col">
//                         <p className="text-sm font-medium">{item.name}</p>
//                         <p className="text-xs text-gray-500">
//                           Qty: {item.quantity} × {currency}{item.finalPrice}
//                         </p>
//                         {item.couponDiscount > 0 && (
//                           <p className="text-xs text-green-600">
//                             Coupon: -{currency}{item.couponDiscount}
//                           </p>
//                         )}
//                         <p className="text-xs font-semibold text-gray-800">
//                           Total: {currency}{item.finalPriceTotal}
//                         </p>
//                       </div>
//                     </div>
//                   )) || (
//                     <p className="text-red-400 italic text-xs">No items found</p>
//                   )}
//                 </div>

//                 {/* Amount */}
//                 <div>
//                   <div className="flex flex-col space-y-1 text-xs">
//                     <div className="flex justify-between text-gray-500">
//                       <span>Total:</span>
//                       <span>{currency}{order.amount}</span>
//                     </div>
//                     <div className="flex justify-between text-orange-600">
//                       <span>Wallet:</span>
//                       <span>-{currency}{order.walletDeduction || 0}</span>
//                     </div>
//                     <div className="flex justify-between font-bold text-gray-900 border-t pt-1 border-gray-100">
//                       <span>Payable:</span>
//                       <span>{currency}{(order.amount || 0) - (order.walletDeduction || 0)}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Payment */}
//                 <div>
//                   <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                     {order.isPaid ? 'PAID' : 'UNPAID'}
//                   </span>
//                   <p className="text-[10px] text-gray-400 mt-2 font-medium">{order.paymentType}</p>
//                 </div>

//                 {/* Status Dropdown */}
//                 <div className="flex flex-col items-start sm:items-end">
//                   <select
//                     className="p-2 bg-gray-50 border border-gray-300 text-sm rounded focus:ring-blue-500 focus:border-blue-500"
//                     value={order.status}
//                     onChange={(e) => updateStatus(order._id, e.target.value)}
//                   >
//                     {statusOptions.map((status) => (
//                       <option key={status} value={status}>{status}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300 text-gray-400">
//               No orders available for dispatch.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DispatcherPage;






// import React, { useEffect, useState } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import { toast } from 'react-hot-toast';
// import axios from 'axios';

// const statusOptions = [
//   "Order Placed",
//   "Packing",
//   "Shipped",
//   "Out for delivery",
//   "Delivered"
// ];

// const DispatcherPage = () => {
//   const { currency, isDispatcher } = useAppContext();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch all orders
//   const fetchAllOrders = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get('/api/dispatcher/orders', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('dispatcherToken')}`,
//         },
//       });
//       if (data.success) setOrders(data.orders || []);
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to load orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update order status
//   const updateStatus = async (orderId, status) => {
//     try {
//       const { data } = await axios.post(
//         '/api/dispatcher/update-status',
//         { orderId, status },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('dispatcherToken')}`,
//           },
//         }
//       );
//       if (data.success) {
//         toast.success(data.message);
//         setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to update status");
//     }
//   };

//   useEffect(() => {
//     if (isDispatcher) fetchAllOrders();
//   }, [isDispatcher]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-6xl mx-auto p-5 sm:p-8">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-semibold text-gray-700">
//             All Delivery Orders
//           </h2>
//           <span className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
//             Total: {orders.length}
//           </span>
//         </div>

//         {loading ? (
//           <div className="flex items-center justify-center py-20 bg-white border border-gray-200 rounded-lg">
//             <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
//           </div>
//         ) : orders.length === 0 ? (
//           <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300 text-gray-400">
//             No orders available for dispatch.
//           </div>
//         ) : (
//           <div className="flex flex-col gap-4">
//             {orders.map((order, idx) => (
//               <div
//                 key={order._id}
//                 className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] items-start gap-4 p-5 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
//               >
//                 {/* Icon */}
//                 <div className="hidden sm:block">
//                   <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
//                     <img src={order.image} alt="" />
//                   </div>
//                 </div>

//                 {/* Customer & Address */}
//                 <div>
//                   <p className="font-semibold text-gray-800">
//                     {order.address?.firstName} {order.address?.lastName}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     {order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.zipcode}
//                   </p>
//                   <p className="text-xs text-gray-400">📞 {order.address?.phone}</p>
//                 </div>

//                 {/* Items with image on left */}
//                 <div className="space-y-2">
//                   {order.items?.map((item, i) => (
//                     <div key={i} className="flex items-center gap-3 border-b border-gray-100 pb-2 last:border-0">
//                       {/* Product Image */}
//                       <img
//                         src={item.image?.[0] || "/placeholder.png"}
//                         alt={item.name}
//                         className="w-12 h-12 object-contain rounded"
//                       />
//                       {/* Item Info */}
//                       <div className="flex flex-col">
//                         <p className="text-sm font-medium">{item.name}</p>
//                         <p className="text-xs text-gray-500">
//                           Qty: {item.quantity} × {currency}{item.finalPrice}
//                         </p>
//                         {item.couponDiscount > 0 && (
//                           <p className="text-xs text-green-600">
//                             Coupon: -{currency}{item.couponDiscount}
//                           </p>
//                         )}
//                         <p className="text-xs font-semibold">
//                           Total: {currency}{item.finalPriceTotal}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Amounts */}
//                 <div className="flex flex-col text-sm text-gray-700 space-y-1">
//                   <div className="flex justify-between">
//                     <span>Total:</span>
//                     <span>{currency}{order.amount}</span>
//                   </div>
//                   <div className="flex justify-between text-orange-600">
//                     <span>Wallet:</span>
//                     <span>-{currency}{order.walletDeduction || 0}</span>
//                   </div>
//                   <div className="flex justify-between font-bold border-t pt-1 border-gray-200">
//                     <span>Payable:</span>
//                     <span>{currency}{(order.amount || 0) - (order.walletDeduction || 0)}</span>
//                   </div>
//                 </div>

//                 {/* Payment */}
//                 <div>
//                   <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                     {order.isPaid ? "PAID" : "UNPAID"}
//                   </span>
//                   <p className="text-[10px] text-gray-400 mt-1">{order.paymentType}</p>
//                 </div>

//                 {/* Status */}
//                 <div className="flex flex-col items-start sm:items-end">
//                   <select
//                     className="p-2 bg-gray-50 border border-gray-300 text-sm rounded focus:ring-blue-500 focus:border-blue-500"
//                     value={order.status}
//                     onChange={(e) => updateStatus(order._id, e.target.value)}
//                   >
//                     {statusOptions.map(status => (
//                       <option key={status} value={status}>{status}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DispatcherPage;




import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';



const statusOptions = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for delivery",
  "Delivered"
];

const DispatcherPage = () => {
  const { currency, isDispatcher } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders from API
  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/dispatcher/orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('dispatcherToken')}`,
        },
      });
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Update order status logic
  const updateStatus = async (orderId, status) => {
    try {
      const { data } = await axios.post(
        '/api/dispatcher/update-status',
        { orderId, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('dispatcherToken')}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    if (isDispatcher) fetchAllOrders();
  }, [isDispatcher]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Dispatcher Dashboard</h2>
            <p className="text-sm text-gray-500">Manage and track outgoing deliveries</p>
          </div>
          <div className="bg-white shadow-sm border px-4 py-2 rounded-lg text-sm font-medium">
            Live Orders: <span className="text-blue-600 font-bold">{orders.length}</span>
          </div>
        </div>

        {loading ? (
          /* Loading State */
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border">
            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 animate-pulse">Fetching latest orders...</p>
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
            No orders available for dispatch at the moment.
          </div>
        ) : (
          /* Main Table */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Order Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Products</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Customer Info</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Payment Summary</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                      
                      {/* 1. DATE COLUMN */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {new Date(order.date || order.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-[11px] text-gray-400 uppercase tracking-tighter">
                          {new Date(order.date || order.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </td>

                      {/* 2. PRODUCT IMAGE & NAME */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-3">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <img 
                                src={item.image?.[0] || "/placeholder.png"} 
                                className="w-10 h-10 object-contain rounded bg-gray-50 border" 
                                alt={item.name} 
                              />
                              <div className="leading-tight">
                                <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* 3. NAME & ADDRESS */}
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-bold text-gray-900">{order.address?.firstName} {order.address?.lastName}</p>
                          <p className="text-gray-500 text-xs leading-relaxed mt-1">
                            {order.address?.street}, {order.address?.city}<br />
                            {order.address?.state} - {order.address?.zipcode}
                          </p>
                          <p className="text-blue-600 text-xs mt-1 font-semibold">📞 {order.address?.phone}</p>
                        </div>
                      </td>

                      {/* 4. TOTAL CALCULATION & PAYMENT */}
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {/* Paid/Unpaid Badge */}
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {order.isPaid ? "PAID" : "UNPAID"}
                            </span>
                            {/* Payment Method Badge */}
                            <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold uppercase">
                              {order.paymentMethod || order.paymentType || "COD"}
                            </span>
                          </div>
                          
                          <div className="text-xs space-y-0.5">
                            <div className="flex justify-between text-gray-400">
                              <span>Subtotal:</span>
                              <span>{currency}{order.amount}</span>
                            </div>
                            <div className="flex justify-between text-orange-500">
                              <span>Wallet:</span>
                              <span>-{currency}{order.walletDeduction || 0}</span>
                            </div>
                            <div className="flex justify-between font-bold text-gray-900 border-t pt-1 mt-1">
                              <span>Payable:</span>
                              <span>{currency}{(order.amount || 0) - (order.walletDeduction || 0)}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 5. STATUS SELECT */}
                      <td className="px-6 py-4 text-center">
                        <select
                          className={`text-xs font-bold rounded-lg inline-block w-full max-w-[150px] p-2 border transition-all outline-none focus:ring-2 focus:ring-blue-400
                            ${order.status === 'Delivered' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-300 text-gray-700'}`}
                          value={order.status}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DispatcherPage;