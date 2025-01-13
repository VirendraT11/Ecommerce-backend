const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res) => {
    try{
        const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
        res.json(cart);
    } catch(err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try{
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        let cart = await Cart.findOne({ userId: req.user.id });
        if(!cart) {
            cart = new Cart({ userId: req.user.id });
        }
        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else { 
            cart.products.push({ productId, quantity });
        }
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

module.exports = { getCart, addToCart };