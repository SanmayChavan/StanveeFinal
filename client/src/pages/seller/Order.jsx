// import React, { useEffect, useState } from 'react'
// import { useAppContext } from '../../context/AppContext'
// import axios from 'axios'
// import toast from 'react-hot-toast'

// const Order = () => {
//   const { currency } = useAppContext()
//   const [orders, setOrders] = useState([])

//   const fetchOrders = async () => {
//     try {
//       const { data } = await axios.get('/api/order/seller') // admin fetch
//       if (data?.success) setOrders(data.orders || [])
//     } catch (err) {
//       toast.error(err?.message || 'Something went wrong')
//     }
//   }

//   useEffect(() => {
//     fetchOrders()
//   }, [])

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case 'Delivered':
//         return 'bg-green-100 text-green-700'
//       case 'Shipped':
//         return 'bg-blue-100 text-blue-700'
//       case 'Pending':
//       default:
//         return 'bg-orange-100 text-orange-700'
//     }
//   }

//   return (
//     <div className="flex-1 h-[95vh] bg-gray-50 overflow-hidden">
//       <div className="p-4 md:p-6 lg:p-10 h-full flex flex-col">
//         <h2 className="text-2xl font-semibold text-primary mb-4">Orders</h2>

//         {/* ================= TABLE VIEW ================= */}
//         <div className="hidden lg:block flex-1 bg-white border border-primary/20 rounded-xl overflow-y-auto">
//           <table className="w-full table-fixed">
//             <thead className="sticky top-0 bg-primary z-10 shadow-md">
//               <tr className="text-left text-sm font-semibold text-white">
//                 <th className="px-4 py-4 w-[4%]">#</th>
//                 <th className="px-4 py-4 w-[26%]">Items</th>
//                 <th className="px-4 py-4 w-[16%]">Customer</th>
//                 <th className="px-4 py-4 w-[22%]">Address</th>
//                 <th className="px-4 py-4 w-[10%]">Unit Price</th>
//                 <th className="px-4 py-4 w-[10%]">Total</th>
//                 <th className="px-4 py-4 w-[10%]">Payment</th>
//                 <th className="px-4 py-4 w-[12%]">Status</th>
//                 <th className="px-4 py-4 w-[10%]">Date</th>
//               </tr>
//             </thead>

//             <tbody>
//               {orders.map((order, idx) => (
//                 <tr
//                   key={idx}
//                   className="border-t hover:bg-primary/5 transition text-sm align-top"
//                 >
//                   <td className="px-4 py-3 font-medium text-primary-dull">{idx + 1}</td>

//                   {/* Items */}
//                   <td className="px-4 py-3 break-words">
//                     {order.items.map((item, i) => (
//                       <p key={i} className="leading-snug">
//                         {item.product?.name || 'Product unavailable'}
//                         <span className="text-primary font-medium"> × {item.quantity}</span>
//                         {item.couponSelected && (
//                           <span className="text-green-600 text-xs ml-1">
//                             (Coupon used: -{currency}{item.couponDiscount || 0})
//                           </span>
//                         )}
//                       </p>
//                     ))}
//                   </td>

//                   {/* Customer */}
//                   <td className="px-4 py-3">
//                     <p className="font-medium">{order.address?.firstName} {order.address?.lastName}</p>
//                     <p className="text-gray-500 text-xs">{order.address?.phone}</p>
//                   </td>

//                   {/* Address */}
//                   <td className="px-4 py-3 text-gray-600 text-xs leading-snug">
//                     <p>{order.address?.street}</p>
//                     <p>{order.address?.city}, {order.address?.state}</p>
//                     <p>{order.address?.zipcode}, {order.address?.country}</p>
//                   </td>

//                   {/* Unit Price */}
//                   <td className="px-4 py-3 font-medium text-primary-dull">
//                     {order.items.map((item, i) => (
//                       <p key={i}>
//                         {currency}{item.finalPrice} {/* price per unit */}
//                       </p>
//                     ))}
//                   </td>

//                   {/* Total per item */}
//                   <td className="px-4 py-3 font-medium text-primary-dull">
//                     {order.items.map((item, i) => (
//                       <p key={i}>
//                         {currency}{item.finalPriceTotal} {/* total price per line */}
//                       </p>
//                     ))}
//                   </td>

//                   {/* Payment */}
//                   <td className="px-4 py-3">
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         order.isPaid ? 'bg-primary/20 text-primary-dull' : 'bg-orange-100 text-orange-700'
//                       }`}
//                     >
//                       {order.isPaid ? 'Paid' : 'Pending'}
//                     </span>
//                     <p className="text-xs text-gray-500 mt-1">{order.paymentType}</p>
//                   </td>

//                   {/* Status */}
//                   <td className="px-4 py-3">
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}
//                     >
//                       {order.status}
//                     </span>
//                   </td>

//                   {/* Date */}
//                   <td className="px-4 py-3 text-xs text-gray-600">
//                     {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {orders.length === 0 && (
//             <div className="text-center py-20 text-gray-500">No orders found 📦</div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Order

import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Order = () => {
  const { currency } = useAppContext();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/seller'); // admin fetch
      if (data?.success) setOrders(data.orders || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'Shipped':
        return 'bg-blue-100 text-blue-700';
      case 'Pending':
      default:
        return 'bg-orange-100 text-orange-700';
    }
  };

  return (
    <div className="flex-1 h-[95vh] bg-gray-50 overflow-hidden">
      <div className="p-4 md:p-6 lg:p-10 h-full flex flex-col">
        <h2 className="text-2xl font-semibold text-primary mb-4">Orders</h2>

        {/* ================= TABLE VIEW ================= */}
        <div className="hidden lg:block flex-1 bg-white border border-primary/20 rounded-xl overflow-y-auto">
          <table className="w-full table-fixed">
            <thead className="sticky top-0 bg-primary z-10 shadow-md">
              <tr className="text-left text-sm font-semibold text-white">
                <th className="px-4 py-4 w-[4%]">#</th>
                <th className="px-4 py-4 w-[26%]">Items</th>
                <th className="px-4 py-4 w-[16%]">Customer</th>
                <th className="px-4 py-4 w-[22%]">Address</th>
                <th className="px-4 py-4 w-[10%]">Unit Price</th>
                <th className="px-4 py-4 w-[10%]">Total</th>
                <th className="px-4 py-4 w-[10%]">Payment</th>
                <th className="px-4 py-4 w-[12%]">Status</th>
                <th className="px-4 py-4 w-[10%]">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, idx) => (
                <tr key={idx} className="border-t hover:bg-primary/5 transition text-sm align-top">
                  <td className="px-4 py-3 font-medium text-primary-dull">{idx + 1}</td>

                  {/* Items */}
                  <td className="px-4 py-3 break-words">
                    {order.items.map((item, i) => (
                      <p key={i} className="leading-snug">
                        {item.name || 'Product unavailable'}
                        <span className="text-primary font-medium"> × {item.quantity}</span>
                        {item.couponSelected && item.couponDiscount > 0 && (
                          <span className="text-green-600 text-xs ml-1">
                            (Coupon: -{currency}{item.couponDiscount})
                          </span>
                        )}
                      </p>
                    ))}
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.user?.name || '-'}</p>
                    <p className="text-gray-500 text-xs">{order.user?.phone || '-'}</p>
                  </td>

                  {/* Address */}
                  <td className="px-4 py-3 text-gray-600 text-xs leading-snug">
                    <p>{order.address?.firstName} {order.address?.lastName}</p>
                    <p>{order.address?.street}</p>
                    <p>{order.address?.city}, {order.address?.state}</p>
                    <p>{order.address?.zipcode}, {order.address?.country}</p>
                  </td>

                  {/* Unit Price */}
                  <td className="px-4 py-3 font-medium text-primary-dull">
                    {order.items.map((item, i) => (
                      <p key={i}>{currency}{item.finalPrice}</p>
                    ))}
                  </td>

                  {/* Total per item */}
                  <td className="px-4 py-3 font-medium text-primary-dull">
                    {order.items.map((item, i) => (
                      <p key={i}>{currency}{item.finalPriceTotal}</p>
                    ))}
                  </td>

                  {/* Payment */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.isPaid ? 'bg-primary/20 text-primary-dull' : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{order.paymentType}</p>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="text-center py-20 text-gray-500">No orders found 📦</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;