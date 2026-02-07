// import React, { useEffect, useState } from 'react'
// import { useAppContext } from '../../context/AppContext';
// import { assets, dummyOrders } from '../../assets/assets';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const Order = () => {
//   const { currency } = useAppContext();
//   const [orders, setOrders] = useState([]);

//   const fetchOrders = async () => {
//     try {
//       const { data } = await axios.get('/api/order/seller');
//       if (data?.success) { // optional chaining added here
//         setOrders(data?.orders || []); // optional chaining & fallback
//       }
//     } catch (err) {
//       toast.error(err?.message || "Something went wrong"); // optional chaining
//     }
//   }

//   useEffect(() => {
//     fetchOrders();
//   }, []); // changed dependency to [] to avoid infinite loop

//   return (
//     <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
//       <div className="md:p-10 p-4 space-y-4">
//         <h2 className="text-lg font-medium">Orders List</h2>
//         {orders?.map((order, index) => ( // optional chaining here
//           <div key={index} className="flex flex-col md:flex-row md:items-center gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300">
//             <div className="flex gap-5 max-w-80">
//               <img className="w-12 h-12 object-cover" src={assets?.box_icon} alt="boxIcon" />
//               <div>
//                 {order?.items?.map((item, idx) => ( // optional chaining
//                   <div key={idx} className="flex flex-col">
//                     <p className="font-medium">
//                       {item?.product?.name} <span className='text-primary'>x {item?.quantity}</span>
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="text-sm md:text-base text-black/60">
//               <p className='text-black/80'>{order?.address?.firstName} {order?.address?.lastName}</p>
//               <p>{order?.address?.street}, {order?.address?.city}</p>
//               <p>{order?.address?.state}, {order?.address?.zipcode}, {order?.address?.country}</p>
//               <p>{order?.address?.phone}</p>
//             </div>

//             <p className="font-medium text-lg my-auto">{currency}{order?.amount}</p>

//             <div className="flex flex-col text-sm md:text-base text-black/60">
//               <p>Method: {order?.paymentType}</p>
//               <p>Date: {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</p>
//               <p>Payment: {order?.isPaid ? "Paid" : "Pending"}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Order;



import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const Order = () => {
  const { currency } = useAppContext()
  const [orders, setOrders] = useState([])

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/seller')
      if (data?.success) {
        setOrders(data.orders || [])
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong')
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className="flex-1 h-[95vh] bg-gray-50 overflow-hidden">
      <div className="p-4 md:p-6 lg:p-10 h-full flex flex-col">
        <h2 className="text-2xl font-semibold text-primary mb-4">
          Orders
        </h2>

        {/* ================= TABLE VIEW ================= */}
        <div className="hidden lg:block flex-1 bg-white border border-primary/20 rounded-xl overflow-y-auto">
          <table className="w-full table-fixed">
            <thead className="sticky top-0 bg-primary z-10 shadow-md">
              <tr className="text-left text-sm font-semibold text-white">
                <th className="px-4 py-4 w-[6%]">#</th>
                <th className="px-4 py-4 w-[26%]">Items</th>
                <th className="px-4 py-4 w-[16%]">Customer</th>
                <th className="px-4 py-4 w-[22%]">Address</th>
                <th className="px-4 py-4 w-[10%]">Amount</th>
                <th className="px-4 py-4 w-[10%]">Payment</th>
                <th className="px-4 py-4 w-[10%]">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-primary/5 transition text-sm align-top"
                >
                  <td className="px-4 py-3 font-medium text-primary-dull">
                    {index + 1}
                  </td>

                  <td className="px-4 py-3 break-words">
                    {order?.items?.map((item, idx) => (
                      <p key={idx} className="leading-snug">
                        {item?.product?.name}
                        <span className="text-primary font-medium">
                          {' '}
                          × {item?.quantity}
                        </span>
                      </p>
                    ))}
                  </td>

                  <td className="px-4 py-3">
                    <p className="font-medium">
                      {order?.address?.firstName}{' '}
                      {order?.address?.lastName}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {order?.address?.phone}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-gray-600 text-xs leading-snug">
                    <p>{order?.address?.street}</p>
                    <p>
                      {order?.address?.city},{' '}
                      {order?.address?.state}
                    </p>
                    <p>
                      {order?.address?.zipcode},{' '}
                      {order?.address?.country}
                    </p>
                  </td>

                  <td className="px-4 py-3 font-semibold text-primary-dull">
                    {currency}{order?.amount}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order?.isPaid
                          ? 'bg-primary/20 text-primary-dull'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {order?.isPaid ? 'Paid' : 'Pending'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {order?.paymentType}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-xs text-gray-600">
                    {order?.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No orders found 📦
            </div>
          )}
        </div>

        {/* ================= CARD VIEW ================= */}
        <div className="lg:hidden flex-1 overflow-y-auto space-y-4">
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-white border border-primary/20 rounded-xl p-4 space-y-3 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold text-primary-dull">
                  Order #{index + 1}
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order?.isPaid
                      ? 'bg-primary/20 text-primary-dull'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {order?.isPaid ? 'Paid' : 'Pending'}
                </span>
              </div>

              <div className="text-sm">
                {order?.items?.map((item, idx) => (
                  <p key={idx}>
                    {item?.product?.name}
                    <span className="text-primary">
                      {' '}
                      × {item?.quantity}
                    </span>
                  </p>
                ))}
              </div>

              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-800">
                  {order?.address?.firstName}{' '}
                  {order?.address?.lastName}
                </p>
                <p>{order?.address?.phone}</p>
                <p>
                  {order?.address?.street},{' '}
                  {order?.address?.city}
                </p>
              </div>

              <div className="flex justify-between items-center text-sm">
                <p className="font-semibold text-primary-dull">
                  {currency}{order?.amount}
                </p>
                <p className="text-gray-500">
                  {order?.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : '-'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Order

