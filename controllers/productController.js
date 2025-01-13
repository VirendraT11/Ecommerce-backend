const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try{
        const products = await Product.find();
        res.json(products);
    } catch(err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

const getProductById = async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch(err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

const createProduct = async (req, res) => {
    const { name, description, price, category, stock, imageUrl} = req.body;
    try{
        const product = new Product({ name, description, price, category, stock, imageUrl });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = { getProducts, getProductById, createProduct };