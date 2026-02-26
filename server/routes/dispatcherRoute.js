import express from 'express';
import { 
  dispatcherLogin, 
  dispatcherLogout, 
  isDispatcherAuth 
} from '../controllers/dispatcherController.js';
import { getAllOrder, updateOrderStatus } from '../controllers/orderController.js';
import authDispatcher from '../middlewares/authDispatcher.js';

const dispatcherRouter = express.Router();

// Dispatcher login & logout
dispatcherRouter.post('/login', dispatcherLogin);
dispatcherRouter.post('/logout', dispatcherLogout);

// Check if dispatcher is authenticated
dispatcherRouter.get('/auth', authDispatcher, isDispatcherAuth);

// Protected: Get all orders
dispatcherRouter.get('/orders', authDispatcher, getAllOrder);

// Protected: Update order status
dispatcherRouter.post("/update-status", authDispatcher, updateOrderStatus);

export default dispatcherRouter;