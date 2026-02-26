// import express from 'express' ;
// import { isSellerAuth, sellerLogin, sellerLogout } from '../controllers/sellerController.js';
// import authSeller from '../middlewares/authSeller.js';

// const sellerRouter = express.Router() ;

// sellerRouter.post('/login', sellerLogin) ;
// sellerRouter.get('/is-auth', authSeller, isSellerAuth) ;
// sellerRouter.post('/logout', sellerLogout) ;

// export default sellerRouter ;


import express from 'express';
import { isSellerAuth, sellerLogin, sellerLogout } from '../controllers/sellerController.js';
import authSeller from '../middlewares/authSeller.js';
import { updateOrderStatus, getAllOrder } from '../controllers/orderController.js';

const sellerRouter = express.Router();

// Seller login
sellerRouter.post('/login', sellerLogin);

// Check if seller is authenticated
sellerRouter.get('/is-auth', authSeller, isSellerAuth);

// Seller logout
sellerRouter.post('/logout', sellerLogout);

// Seller can view all orders (optional: you may filter to their products)
sellerRouter.get('/orders', authSeller, getAllOrder);

// Seller can update order status
sellerRouter.post('/update-status', authSeller, updateOrderStatus);

export default sellerRouter;