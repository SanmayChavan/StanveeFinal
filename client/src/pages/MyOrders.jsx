// import React, { useEffect, useState } from 'react'
// import { useAppContext } from '../context/AppContext';
// import { dummyOrders } from '../assets/assets';

// const MyOrders = () => {

//     const [myOrders, setMyOrders] = useState([]) ;
//     const {currency, axios, user} = useAppContext() ;

//     const fetchMyOrders = async() => {
//         try{        
//             const { data } = await axios.post('/api/order/user', {userId: user._id}) ;
//             if(data.success){
//                 setMyOrders(data.orders) ;
//             }
//         }catch(err){
//             console.log(err.message) ;
//         }
//     }

//     useEffect(() => {
//         if(user){
//             fetchMyOrders() ;
//         }
        
//     }, [user])

//   return (
//     <div className='mt-16 pl-10 '>
//         <div className='flex flex-col items-end w-max mb-8'>
//             <p className='text-2xl font-medium uppercase'>My Orders</p>
//             <div className='w-16 h-0.5 rounded-full bg-primary'></div>
//         </div>

//         {
//             myOrders?.map((order, index) => (
//                 <div key={index} className='border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl'>
//                     <p className='flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col'>
//                         <span>OrderId : {order?._id}</span>
//                         <span>Payment : {order?.paymentType}</span>
//                         <span>Total Amount : {currency}{order?.amount}</span>
//                     </p>

//                     {
//                         order?.items?.map((item, index) => (
//                             <div key={index} className={`relative bg-white text-gray-500/70 ${
//                                 order.items.length !== index + 1 && "border-b"
//                             } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4
//                             py-5 md:gap-16 w-full max-w-4xl`} >
//                                 <div className='flex items-center mb-4 md:mb-0'>

//                                     <div className='bg-primary/10 p-4 rounded-lg'>
//                                         <img src={item?.product?.image[0]} className="w-16 h-16" alt="product image"/>
//                                     </div>

//                                     <div className='ml-4'>
//                                         <h2 className='text-xl font-medium text-gray-800 '>{item?.product?.name}</h2>
//                                         <p>Category : {item?.product?.category}</p>
//                                     </div>

//                                 </div>

//                                 <div className='flex flex-col justify-center md:ml-8 mb-4 md:mb-0'>
//                                     <p>Quantity : {item?.quantity || 1}</p>
//                                     <p>Status : {order?.status}</p>
//                                     <p>Date : {new Date(order?.createdAt).toLocaleDateString()}</p>
//                                 </div>

//                                 <p className='text-primary text-lg font-medium'>
//                                     Amount : {currency}{item?.product?.offerPrice * item?.quantity}
//                                 </p>
//                             </div>
//                         ))
//                     }
//                 </div>
//             ))
//         }
        
//     </div>
    
//   )
// }

// export default MyOrders



import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'

const MyOrders = () => {

  const [myOrders, setMyOrders] = useState([])
  const { currency, axios, user } = useAppContext()

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.post('/api/order/user', {
        userId: user?._id,
      })

      if (data.success) {
        setMyOrders(data.orders)
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    if (user) fetchMyOrders()
  }, [user])

  return (
    <div className="mt-16 px-4 md:px-10">

      {/* Title */}
      <div className="flex flex-col items-center md:items-end mb-8">
        <p className="text-2xl font-medium uppercase">My Orders</p>
        <div className="w-16 h-0.5 rounded-full bg-primary mt-1"></div>
      </div>

      {/* Orders */}
      {myOrders?.length === 0 && (
        <p className="text-center text-gray-400 mt-20">
          No orders found
        </p>
      )}

      {myOrders?.map((order, index) => (
        <div
          key={index}
          className="border border-gray-300 rounded-lg mb-8 p-4 max-w-4xl mx-auto"
        >

          {/* Order Info */}
          <div className="text-gray-400 text-sm space-y-1 md:space-y-0 md:flex md:justify-between md:items-center md:font-medium">
            <p>Order ID: {order?._id}</p>
            <p>Payment: {order?.paymentType}</p>
            <p>Total: {currency}{order?.amount}</p>
          </div>

          {/* Order Items */}
          {order?.items?.map((item, index) => (
            <div
              key={index}
              className={`bg-white ${
                order.items.length !== index + 1 && 'border-b'
              } border-gray-200 py-4`}
            >

              {/* Top Section */}
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                  <img
                    src={item?.product?.image?.[0]}
                    alt="product"
                    className="w-14 h-14 object-contain"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-base font-medium text-gray-800">
                    {item?.product?.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Category: {item?.product?.category}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Quantity: {item?.quantity || 1}
                  </p>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="flex justify-between items-center mt-3 text-sm">
                <div className="text-gray-500 space-y-1">
                  <p>Status: {order?.status}</p>
                  <p>
                    {new Date(order?.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <p className="text-primary font-medium">
                  {currency}
                  {(item?.product?.offerPrice || 0) * (item?.quantity || 1)}
                </p>
              </div>

            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default MyOrders
