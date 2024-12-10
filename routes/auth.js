import {Router} from 'express';
const router = Router();

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login | Ali',
        isLogin: true
    })
})

router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register | Ali',
        isRegister: true
    })
})

router.post('/login', (req, res) => {
    // TODO: Validate user credentials and redirect to home page
    console.log(req.body);
    
    res.redirect('/')
})

router.post('/register', (req, res) => {
    // TODO: Validate user credentials and redirect to home page
    console.log(req.body);
    
    res.redirect('/')
})

export default router;