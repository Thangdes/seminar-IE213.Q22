import Order from '../models/Order.js';

export const getAllOrders = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user._id };
    const orders = await Order.find(query)
      .populate('user', 'email fullName displayName')
      .populate('items.food', 'name price image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const { customerName, items, totalPrice, note } = req.body;

    const order = await Order.create({
      user: req.user._id,
      customerName,
      items,
      totalPrice,
      note,
    });

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Chi admin moi co quyen duyet don hang',
      });
    }

    const { id } = req.params;
    const updates = {};

    if (Object.prototype.hasOwnProperty.call(req.body, 'status')) {
      updates.status = req.body.status;
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật đơn hàng thành công',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const reviewOrder = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin khong the danh gia don hang',
      });
    }

    const { id } = req.params;
    const rating = Number(req.body.rating);
    const comment = typeof req.body.comment === 'string' ? req.body.comment.trim() : '';

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Diem danh gia phai tu 1 den 5',
      });
    }

    if (comment.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Noi dung danh gia khong duoc qua 500 ky tu',
      });
    }

    const order = await Order.findOne({ _id: id, user: req.user._id });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Khong tim thay don hang',
      });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Chi co the danh gia don da giao',
      });
    }

    order.review = {
      rating,
      comment,
      reviewedAt: new Date(),
    };

    await order.save();
    await order.populate('user', 'email fullName displayName');
    await order.populate('items.food', 'name price image');

    res.status(200).json({
      success: true,
      message: 'Da luu danh gia don hang',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Chi admin moi co quyen xoa don hang',
      });
    }

    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa đơn hàng thành công',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
