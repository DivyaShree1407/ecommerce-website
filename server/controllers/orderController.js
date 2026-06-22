const Order = require('../models/Order');
const Product = require('../models/Products');

// @route  POST /api/orders
// @access User
exports.placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: 'No items in order' });

    let total = 0;
    const orderItems = [];

    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({ message: `Product not found: ${item.productId}` });

      if (product.stock < item.qty)
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });

      product.stock -= item.qty;
      await product.save();

      total += product.price * item.qty;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        qty: item.qty
      });
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      total
    });

    res.status(201).json({ message: 'Order placed successfully', order });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route  GET /api/orders/mine
// @access User
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 });

    res.status(200).json({ count: orders.length, orders });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route  GET /api/orders
// @access Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });

    res.status(200).json({ count: orders.length, orders });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route  PUT /api/orders/:id/status
// @access Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatus = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatus.includes(status))
      return res.status(400).json({ message: 'Invalid status value' });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order)
      return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({ message: 'Order status updated', order });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route  GET /api/orders/:id
// @access User/Admin
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name price image');

    if (!order)
      return res.status(404).json({ message: 'Order not found' });

    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    res.status(200).json({ order });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};