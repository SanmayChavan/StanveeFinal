import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Order = () => {
  const { currency } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // 1. Added loading state

  const fetchOrders = async () => {
    try {
      setLoading(true); // Ensure loader shows on refresh
      const { data } = await axios.get('/api/order/seller'); 
      if (data?.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false); // 2. Stop loader regardless of success/fail
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="flex-1 h-[95vh] bg-gray-50 overflow-hidden">
      <div className="p-4 md:p-6 lg:p-10 h-full flex flex-col">
        <h2 className="text-2xl font-semibold text-primary mb-4">
          Orders {!loading && `(${orders.length})`}
        </h2>

        {/* ================= CONDITIONALLY RENDER LOADER OR TABLE ================= */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-white border border-primary/20 rounded-xl shadow-sm">
            {/* Custom Spinner */}
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium animate-pulse">Fetching latest orders...</p>
          </div>
        ) : (
          <div className="hidden lg:block flex-1 bg-white border border-primary/20 rounded-xl overflow-y-auto shadow-sm">
            {orders.length > 0 ? (
              <table className="w-full table-fixed border-collapse">
                <thead className="sticky top-0 bg-primary z-10">
                  <tr className="text-left text-xs font-bold text-white uppercase tracking-wider">
                    <th className="px-4 py-4 w-[4%]">#</th>
                    <th className="px-4 py-4 w-[24%]">Items & Breakdown</th>
                    <th className="px-4 py-4 w-[14%]">Customer</th>
                    <th className="px-4 py-4 w-[20%]">Shipping Address</th>
                    <th className="px-4 py-4 w-[12%]">Financials</th>
                    <th className="px-4 py-4 w-[10%]">Payment</th>
                    <th className="px-4 py-4 w-[10%]">Status</th>
                    <th className="px-4 py-4 w-[6%]">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {orders.map((order, idx) => (
                    <tr key={order._id} className="hover:bg-blue-50/30 transition text-sm align-top">
                      <td className="px-4 py-4 font-medium text-gray-400">{idx + 1}</td>

                      {/* Items Breakdown */}
                      <td className="px-4 py-4">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, i) => (
                            <div key={i} className="mb-2 pb-2 border-b border-gray-100 last:border-0">
                              <p className="font-semibold text-gray-800 leading-tight">
                                {item.name} <span className="text-primary">× {item.quantity}</span>
                              </p>
                              <div className="text-[11px] text-gray-500 flex justify-between mt-1">
                                <span>Unit: {currency}{item.finalPrice}</span>
                                {item.couponDiscount > 0 && (
                                  <span className="text-green-600 font-medium">Coupon: -{currency}{item.couponDiscount}</span>
                                )}
                                <span className="font-medium text-gray-700">Sub: {currency}{item.finalPriceTotal}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <span className="text-red-400 italic text-xs">No items found</span>
                        )}
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-4">
                        <p className="font-bold text-gray-800">{order.user?.name || "N/A"}</p>
                        <p className="text-gray-500 text-xs truncate">{order.user?.email}</p>
                        <p className="text-primary text-xs font-semibold mt-1">📞 {order.address?.phone || 'No Phone'}</p>
                      </td>

                      {/* Address */}
                      <td className="px-4 py-4 text-gray-600 text-xs leading-relaxed">
                        {order.address?.isLegacy ? (
                          <p className="italic">{order.address.full}</p>
                        ) : (
                          <>
                            <p className="font-medium text-gray-800">{order.address?.firstName} {order.address?.lastName}</p>
                            <p>{order.address?.street}</p>
                            <p>{order.address?.city}, {order.address?.state} - {order.address?.zipcode}</p>
                          </>
                        )}
                      </td>

                      {/* Financials */}
                      <td className="px-4 py-4">
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between text-gray-500">
                            <span>Total:</span>
                            <span>{currency}{order.amount}</span>
                          </div>
                          <div className="flex justify-between text-orange-600">
                            <span>Wallet:</span>
                            <span>-{currency}{order.walletDeduction || 0}</span>
                          </div>
                          <div className="flex justify-between font-bold text-gray-900 border-t pt-1 border-gray-100">
                            <span>Payable:</span>
                            <span>{currency}{(order.amount || 0) - (order.walletDeduction || 0)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Payment */}
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {order.isPaid ? 'PAID' : 'UNPAID'}
                        </span>
                        <p className="text-[10px] text-gray-400 mt-2 font-medium">{order.paymentType}</p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 text-center">
                        <span className="bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded-md text-[11px] font-bold">
                          {order.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4 text-[11px] text-gray-400 whitespace-nowrap">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 italic">
                No orders found 📦
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;