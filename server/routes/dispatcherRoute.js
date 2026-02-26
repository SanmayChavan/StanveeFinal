import express from 'express';
import { dispatcherLogin, dispatcherLogout, isDispatcherAuth } from '../controllers/dispatcherController.js';
import { getAllOrder } from '../controllers/orderController.js';
import authDispatcher from '../middlewares/authDispatcher.js';

const dispatcherRouter = express.Router();

dispatcherRouter.post('/login', dispatcherLogin);
dispatcherRouter.post('/logout', dispatcherLogout);
dispatcherRouter.get('/auth', authDispatcher, isDispatcherAuth);

// The actual orders for the dispatcher
dispatcherRouter.get('/orders', authDispatcher, getAllOrder);

export default dispatcherRouter;