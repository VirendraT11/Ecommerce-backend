const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
    try{
        const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
        if(!cart || cart.products.length === 0) return res.status(400).json({ msg: 'Cart is empty' });
        const totalAmount = cart.products.reduce((total, item) => total + item.productId.price * item.quantity, 0);
        const order = new Order({
            userId: req.user.id,
            products: cart.products.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity,
            })),
            totalAmount,
        });
        await order.save();
        await Cart.findOneAndDelete({ userId: req.user.id });

        res.status(201).json(order);
    } catch(err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

const getOrders = async (req, res) => {
    try{
        const orders = await Order.find({ userId: req.user.id }).populate('products.productId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = { createOrder, getOrders };