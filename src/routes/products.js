import { Router } from 'express';
const router = Router();
import Product from '../models/Product.js';
import auth from '../middleware/auth.js';
import userMiddleware from '../middleware/user.js';

router.get('/', async (req, res) => {
    const products = await Product.find({}).sort({ createdAt: -1 }).lean()
    const id = req.userId;
    res.render('index', {
        title: 'Shop | Ali',
        products: products,
        userId: id ? id.toString() : false
    })
})

router.get('/add', auth, (req, res) => {
    res.render('add', {
        title: 'Add Product | Ali',
        isAdd: true,
        errAddProduct: req.flash('errAddProduct')
    })
})

router.get('/products', async (req, res) => {
    const id = req.userId;
    const user = id ? id.toString() : null
    const myProducts = await Product.find({ user }).populate('user').lean()
    res.render('products', {
        title: 'Products | Ali',
        isProduct: true,
        myProducts: myProducts
    })
})

router.post('/add-product', userMiddleware, async (req, res) => {
    const { title, description, img, price } = req.body;
    if (!title || !description || !img || !price) {
        req.flash('errAddProduct', 'Please fill all the fields');
        return res.redirect('/add');
    }
    await Product.create({ ...req.body, user: req.userId });
    res.redirect('/')
})

export default router;