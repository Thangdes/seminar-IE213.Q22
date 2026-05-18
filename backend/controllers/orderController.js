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
