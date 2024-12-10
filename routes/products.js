import {Router} from 'express';
const router = Router();

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Shop | Ali'
    })
})

router.get('/add', (req, res) => {
    res.render('add', {
        title: 'Add Product | Ali',
        isAdd: true
    })
})

router.get('/products', (req, res) => {
    res.render('products', {
        title: 'Products | Ali',
        isProduct: true
    })
})

export default router;