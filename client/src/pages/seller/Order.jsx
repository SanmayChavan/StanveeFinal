// import React, { useEffect, useState } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const Order = () => {
//   const { currency } = useAppContext();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true); // 1. Added loading state

//   const fetchOrders = async () => {
//     try {
//       setLoading(true); // Ensure loader shows on refresh
//       const { data } = await axios.get('/api/order/seller'); 
//       if (data?.success) {
//         setOrders(data.orders || []);
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.message || 'Something went wrong');
//     } finally {
//       setLoading(false); // 2. Stop loader regardless of success/fail
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   return (
//     <div className="flex-1 h-[95vh] bg-gray-50 overflow-hidden">
//       <div className="p-4 md:p-6 lg:p-10 h-full flex flex-col">
//         <h2 className="text-2xl font-semibold text-primary mb-4">
//           Orders {!loading && `(${orders.length})`}
//         </h2>

//         {/* ================= CONDITIONALLY RENDER LOADER OR TABLE ================= */}
//         {loading ? (
//           <div className="flex-1 flex flex-col items-center justify-center bg-white border border-primary/20 rounded-xl shadow-sm">
//             {/* Custom Spinner */}
//             <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
//             <p className="text-gray-500 font-medium animate-pulse">Fetching latest orders...</p>
//           </div>
//         ) : (
//           <div className="hidden lg:block flex-1 bg-white border border-primary/20 rounded-xl overflow-y-auto shadow-sm">
//             {orders.length > 0 ? (
//               <table className="w-full table-fixed border-collapse">
//                 <thead className="sticky top-0 bg-primary z-10">
//                   <tr className="text-left text-xs font-bold text-white uppercase tracking-wider">
//                     <th className="px-4 py-4 w-[4%]">#</th>
//                     <th className="px-4 py-4 w-[24%]">Items & Breakdown</th>
//                     <th className="px-4 py-4 w-[14%]">Customer</th>
//                     <th className="px-4 py-4 w-[20%]">Shipping Address</th>
//                     <th className="px-4 py-4 w-[12%]">Financials</th>
//                     <th className="px-4 py-4 w-[10%]">Payment</th>
//                     <th className="px-4 py-4 w-[10%]">Status</th>
//                     <th className="px-4 py-4 w-[6%]">Date</th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-gray-200">
//                   {orders.map((order, idx) => (
//                     <tr key={order._id} className="hover:bg-blue-50/30 transition text-sm align-top">
//                       <td className="px-4 py-4 font-medium text-gray-400">{idx + 1}</td>

//                       {/* Items Breakdown */}
//                       <td className="px-4 py-4">
//                         {order.items && order.items.length > 0 ? (
//                           order.items.map((item, i) => (
//                             <div key={i} className="mb-2 pb-2 border-b border-gray-100 last:border-0">
//                               <p className="font-semibold text-gray-800 leading-tight">
//                                 {item.name} <span className="text-primary">× {item.quantity}</span>
//                               </p>
//                               <div className="text-[11px] text-gray-500 flex justify-between mt-1">
//                                 {/* <span>Unit: {currency}{item.finalPrice}</span> */}
//                                 {item.couponDiscount > 0 && (
//                                   <span className="text-green-600 font-medium">Coupon: -{currency}{item.couponDiscount}</span>
//                                 )}
//                                 {/* <span className="font-medium text-gray-700">Sub: {currency}{item.finalPriceTotal}</span> */}
//                               </div>
//                             </div>
//                           ))
//                         ) : (
//                           <span className="text-red-400 italic text-xs">No items found</span>
//                         )}
//                       </td>

//                       {/* Customer */}
//                       <td className="px-4 py-4">
//                         <p className="font-bold text-gray-800">{order.user?.name || "N/A"}</p>
//                         <p className="text-gray-500 text-xs truncate">{order.user?.email}</p>
//                         <p className="text-primary text-xs font-semibold mt-1">📞 {order.address?.phone || 'No Phone'}</p>
//                       </td>

//                       {/* Address */}
//                       <td className="px-4 py-4 text-gray-600 text-xs leading-relaxed">
//                         {order.address?.isLegacy ? (
//                           <p className="italic">{order.address.full}</p>
//                         ) : (
//                           <>
//                             <p className="font-medium text-gray-800">{order.address?.firstName} {order.address?.lastName}</p>
//                             <p>{order.address?.street}</p>
//                             <p>{order.address?.city}, {order.address?.state} - {order.address?.zipcode}</p>
//                           </>
//                         )}
//                       </td>

//                       {/* Financials */}
//                       <td className="px-4 py-4">
//                         <div className="space-y-1 text-xs">
//                           <div className="flex justify-between text-gray-500">
//                             <span>Total:</span>
//                             <span>{currency}{order.amount}</span>
//                           </div>
//                           <div className="flex justify-between text-orange-600">
//                             <span>Wallet:</span>
//                             <span>-{currency}{order.walletDeduction || 0}</span>
//                           </div>
//                           <div className="flex justify-between font-bold text-gray-900 border-t pt-1 border-gray-100">
//                             <span>Payable:</span>
//                             <span>{currency}{(order.amount || 0) - (order.walletDeduction || 0)}</span>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Payment */}
//                       <td className="px-4 py-4">
//                         <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                           {order.isPaid ? 'PAID' : 'UNPAID'}
//                         </span>
//                         <p className="text-[10px] text-gray-400 mt-2 font-medium">{order.paymentType}</p>
//                       </td>

//                       {/* Status */}
//                       <td className="px-4 py-4 text-center">
//                         <span className="bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded-md text-[11px] font-bold">
//                           {order.status}
//                         </span>
//                       </td>

//                       {/* Date */}
//                       <td className="px-4 py-4 text-[11px] text-gray-400 whitespace-nowrap">
//                         {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : '-'}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <div className="flex-1 flex items-center justify-center text-gray-500 italic">
//                 No orders found 📦
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Order;





// import React, { useEffect, useState } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const statusOptions = [
//   "Order Placed",
//   "Packing",
//   "Shipped",
//   "Out for delivery",
//   "Delivered"
// ];

// const Order = () => {
//   const { currency } = useAppContext();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get('/api/order/seller');
//       if (data?.success) setOrders(data.orders || []);
//     } catch (err) {
//       toast.error(err?.response?.data?.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const handleStatusChange = async (orderId, newStatus) => {
//     try {
//       const { data } = await axios.post('/api/seller/update-status', {
//         orderId,
//         status: newStatus
//       });

//       if (data.success) {
//         toast.success(data.message);
//         fetchOrders(); // Refresh the table
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.message || 'Failed to update status');
//     }
//   };

//   return (
//     <div className="flex-1 h-[95vh] bg-gray-50 overflow-hidden">
//       <div className="p-4 md:p-6 lg:p-10 h-full flex flex-col">
//         <h2 className="text-2xl font-semibold text-primary mb-4">
//           Orders {!loading && `(${orders.length})`}
//         </h2>

//         {loading ? (
//           <div className="flex-1 flex flex-col items-center justify-center bg-white border border-primary/20 rounded-xl shadow-sm">
//             <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
//             <p className="text-gray-500 font-medium animate-pulse">Fetching latest orders...</p>
//           </div>
//         ) : (
//           <div className="hidden lg:block flex-1 bg-white border border-primary/20 rounded-xl overflow-y-auto shadow-sm">
//             {orders.length > 0 ? (
//               <table className="w-full table-fixed border-collapse">
//                 <thead className="sticky top-0 bg-primary z-10">
//                   <tr className="text-left text-xs font-bold text-white uppercase tracking-wider">
//                     <th className="px-4 py-4 w-[4%]">#</th>
//                     <th className="px-4 py-4 w-[24%]">Items & Breakdown</th>
//                     <th className="px-4 py-4 w-[14%]">Customer</th>
//                     <th className="px-4 py-4 w-[20%]">Shipping Address</th>
//                     <th className="px-4 py-4 w-[12%]">Financials</th>
//                     <th className="px-4 py-4 w-[10%]">Payment</th>
//                     <th className="px-4 py-4 w-[10%]">Status</th>
//                     <th className="px-4 py-4 w-[6%]">Date</th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-gray-200">
//                   {orders.map((order, idx) => (
//                     <tr key={order._id} className="hover:bg-blue-50/30 transition text-sm align-top">
//                       <td className="px-4 py-4 font-medium text-gray-400">{idx + 1}</td>

//                       {/* Items */}
//                       <td className="px-4 py-4">
//                         {order.items?.map((item, i) => (
//                           <div key={i} className="mb-2 pb-2 border-b border-gray-100 last:border-0">
//                             <p className="font-semibold text-gray-800 leading-tight">
//                               {item.name} <span className="text-primary">× {item.quantity}</span>
//                             </p>
//                             {item.couponDiscount > 0 && (
//                               <p className="text-green-600 text-[11px] font-medium mt-1">
//                                 Coupon: -{currency}{item.couponDiscount}
//                               </p>
//                             )}
//                           </div>
//                         )) || <span className="text-red-400 italic text-xs">No items found</span>}
//                       </td>

//                       {/* Customer */}
//                       <td className="px-4 py-4">
//                         <p className="font-bold text-gray-800">{order.user?.name || "N/A"}</p>
//                         <p className="text-gray-500 text-xs truncate">{order.user?.email}</p>
//                         <p className="text-primary text-xs font-semibold mt-1">📞 {order.address?.phone || 'No Phone'}</p>
//                       </td>

//                       {/* Address */}
//                       <td className="px-4 py-4 text-gray-600 text-xs leading-relaxed">
//                         {order.address?.isLegacy ? (
//                           <p className="italic">{order.address.full}</p>
//                         ) : (
//                           <>
//                             <p className="font-medium text-gray-800">{order.address?.firstName} {order.address?.lastName}</p>
//                             <p>{order.address?.street}</p>
//                             <p>{order.address?.city}, {order.address?.state} - {order.address?.zipcode}</p>
//                           </>
//                         )}
//                       </td>

//                       {/* Financials */}
//                       <td className="px-4 py-4">
//                         <div className="space-y-1 text-xs">
//                           <div className="flex justify-between text-gray-500">
//                             <span>Total:</span>
//                             <span>{currency}{order.amount}</span>
//                           </div>
//                           <div className="flex justify-between text-orange-600">
//                             <span>Wallet:</span>
//                             <span>-{currency}{order.walletDeduction || 0}</span>
//                           </div>
//                           <div className="flex justify-between font-bold text-gray-900 border-t pt-1 border-gray-100">
//                             <span>Payable:</span>
//                             <span>{currency}{(order.amount || 0) - (order.walletDeduction || 0)}</span>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Payment */}
//                       <td className="px-4 py-4">
//                         <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                           {order.isPaid ? 'PAID' : 'UNPAID'}
//                         </span>
//                         <p className="text-[10px] text-gray-400 mt-2 font-medium">{order.paymentType}</p>
//                       </td>

//                       {/* Status */}
//                       <td className="px-4 py-4 text-center">
//                         <select
//                           value={order.status}
//                           onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                           className="px-2 py-1 text-xs rounded border border-gray-300 bg-white cursor-pointer"
//                         >
//                           {statusOptions.map((status) => (
//                             <option key={status} value={status}>{status}</option>
//                           ))}
//                         </select>
//                       </td>

//                       {/* Date */}
//                       <td className="px-4 py-4 text-[11px] text-gray-400 whitespace-nowrap">
//                         {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : '-'}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <div className="flex-1 flex items-center justify-center text-gray-500 italic">
//                 No orders found 📦
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Order;


import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const statusOptions = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for delivery",
  "Delivered"
];

const Order = () => {
  const { currency } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/order/seller');
      if (data?.success) setOrders(data.orders || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await axios.post('/api/seller/update-status', {
        orderId,
        status: newStatus
      });

      if (data.success) {
        toast.success(data.message);
        fetchOrders(); 
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="flex-1 h-[95vh] bg-gray-50 overflow-hidden flex flex-col">
      <div className="p-4 md:p-6 h-full flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Orders Management {!loading && <span className="text-primary">({orders.length})</span>}
        </h2>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium animate-pulse">Loading orders...</p>
          </div>
        ) : (
          /* CONTAINER WITH HORIZONTAL SCROLL */
          <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-sm custom-scrollbar">
            {orders.length > 0 ? (
              /* MIN-WIDTH PREVENTS COLUMN MERGING */
              <table className="w-full text-left border-collapse min-w-[1100px]">
                <thead className="sticky top-0 bg-primary z-10">
                  <tr className="text-[10px] font-bold text-white uppercase tracking-widest">
                    <th className="px-3 py-4 w-[40px] text-center">#</th>
                    <th className="px-4 py-4 w-[22%]">Items & Offers</th>
                    <th className="px-4 py-4 w-[15%]">Customer</th>
                    <th className="px-4 py-4 w-[18%]">Shipping Address</th>
                    <th className="px-4 py-4 w-[12%]">Financials</th>
                    <th className="px-4 py-4 w-[8%]">Payment</th>
                    <th className="px-4 py-4 w-[12%]">Status</th>
                    <th className="px-4 py-4 w-[9%] text-center">Date & Time</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {orders.map((order, idx) => (
                    <tr key={order._id} className="hover:bg-blue-50/20 transition-colors text-[12px] align-top">
                      <td className="px-3 py-5 text-gray-400 font-medium text-center">{idx + 1}</td>

                      {/* Items & Coupon */}
                      <td className="px-4 py-5">
                        {order.items?.map((item, i) => (
                          <div key={i} className="mb-2 last:mb-0 border-b border-gray-50 last:border-0 pb-1">
                            <div className="leading-tight">
                              <span className="font-bold text-gray-800">{item.name}</span>
                              <span className="text-primary font-black ml-1 text-[11px]">×{item.quantity}</span>
                            </div>
                            {item.couponDiscount > 0 && (
                              <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[9px] font-black px-1.5 py-0.5 rounded mt-1 uppercase border border-green-100">
                                ✂️ Coupon: -{currency}{item.couponDiscount}
                              </div>
                            )}
                          </div>
                        ))}
                      </td>

                      {/* Customer Info */}
                      <td className="px-4 py-5">
                        <p className="font-bold text-gray-900 text-[13px]">{order.user?.name || "Guest"}</p>
                        <p className="text-gray-400 text-[10px] truncate max-w-[140px]">{order.user?.email}</p>
                        <div className="mt-2 flex items-center gap-1 text-primary font-bold text-[11px]">
                          <span>📞</span> {order.address?.phone || 'N/A'}
                        </div>
                      </td>

                      {/* Shipping Address */}
                      <td className="px-4 py-5 text-gray-600 leading-relaxed text-[11px]">
                        <p className="font-black text-gray-800 uppercase text-[9px] mb-1 tracking-tight">
                          {order.address?.city}, {order.address?.state}
                        </p>
                        <p className="line-clamp-2 italic">{order.address?.street}, {order.address?.zipcode}</p>
                      </td>

                      {/* Financial Summary */}
                      <td className="px-4 py-5">
                        <div className="text-[10px] space-y-1 bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <div className="flex justify-between text-gray-400">
                            <span>Gross:</span>
                            <span>{currency}{order.amount}</span>
                          </div>
                          {order.walletDeduction > 0 && (
                            <div className="flex justify-between text-orange-600 font-bold">
                              <span>Wallet:</span>
                              <span>-{currency}{order.walletDeduction}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-black text-gray-900 border-t border-gray-200 pt-1 mt-1">
                            <span>Net:</span>
                            <span className="text-[12px]">{currency}{(order.amount || 0) - (order.walletDeduction || 0)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Payment Status */}
                      <td className="px-4 py-5">
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {order.isPaid ? 'PAID' : 'UNPAID'}
                        </span>
                        <p className="text-[9px] text-gray-400 mt-2 font-black uppercase tracking-tighter">
                          {order.paymentType || 'COD'}
                        </p>
                      </td>

                      {/* Order Status Select */}
                      <td className="px-4 py-5">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`w-full p-1.5 text-[10px] font-bold rounded-md border cursor-pointer outline-none transition-all
                            ${order.status === 'Delivered' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-700 focus:border-primary'}`}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>

                      {/* Date & Time Column (Vertical Stack) */}
                      <td className="px-4 py-5 text-center whitespace-nowrap bg-gray-50/30">
                        <div className="text-[12px] font-bold text-gray-800 leading-none">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '-'}
                        </div>
                        <div className="text-[10px] font-black text-blue-600 my-1 bg-blue-50 rounded py-0.5">
                          {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : ''}
                        </div>
                        <div className="text-[9px] text-gray-400">
                          {order.createdAt ? new Date(order.createdAt).getFullYear() : ''}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                <span className="text-4xl">📦</span>
                <p className="text-gray-400 font-medium italic">No active orders found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;