import { Router } from 'express';
const router = Router();
import Product from '../models/Product.js';
import auth from '../middleware/auth.js';
import userMiddleware from '../middleware/user.js';

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Shop | Ali'
    })
})

router.get('/add', auth, (req, res) => {
    res.render('add', {
        title: 'Add Product | Ali',
        isAdd: true,
        errAddProduct: req.flash('errAddProduct')
    })
})

router.get('/products', (req, res) => {
    res.render('products', {
        title: 'Products | Ali',
        isProduct: true
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