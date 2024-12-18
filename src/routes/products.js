import { Router } from 'express';
import { Types } from 'mongoose'
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

router.get('/product/:id', async (req, res) => {
    const id = req.params.id;
    if (Types.ObjectId.isValid(id)) {
        const p = await Product.findById(id).populate('user').lean()
        res.render('product', {
            title: 'Product | Ali',
            p: p
        })
        return
    }
    res.send('Protuct not found')
})

router.get('/edit-product/:id', auth, async (req, res) => {
    const id = req.params.id;
    const p = await Product.findById(id).lean()
    res.render('edit-product', {
        title: 'Edit Product | Ali',
        p: p,
        errEditProduct: req.flash('errEditProduct')
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

// edit product
router.post('/edit-product/:id', userMiddleware, async (req, res) => {
    const id = req.params.id;
    const { title, description, img, price } = req.body;
    if (!title || !description || !img || !price) {
        req.flash('errEditProduct', 'Please fill all the fields');
        return res.redirect(`/edit-product/${id}`);
    }
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true })
    console.log(product);
    res.redirect('/products');
})


// delete product
router.post('/delete-product/:id', auth, async (req, res) => {
    const id = req.params.id;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
})

export default router;