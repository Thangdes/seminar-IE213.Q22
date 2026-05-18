import express from 'express';
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  reviewOrder,
  updateOrder,
} from '../controllers/orderController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.route('/').get(getAllOrders).post(createOrder);
router.route('/:id/review').put(reviewOrder);
router.route('/:id').put(updateOrder).delete(deleteOrder);

export default router;
