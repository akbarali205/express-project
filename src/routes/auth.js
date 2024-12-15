import { Router } from 'express';
const router = Router();
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../services/token.js';

router.get('/login', (req, res) => {
    if (req.cookies.token) {
        res.redirect('/')
        return;
    }
    res.render('login', {
        title: 'Login | Ali',
        isLogin: true,
        loginError: req.flash('loginError'),
    })
})

router.get('/register', (req, res) => {
    if (req.cookies.token) {
        res.redirect('/')
        return;
    }
    res.render('register', {
        title: 'Register | Ali',
        isRegister: true,
        registerError: req.flash('registerError'),
    })
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        req.flash('loginError', "All fields are required")
        res.redirect('/login');
        return
    }
    const findUser = await User.findOne({ email });
    if (!findUser) {
        req.flash('loginError', "User not found")
        res.redirect('/login');
        return
    }
    const isPasTrue = await bcrypt.compare(password, findUser.password);
    if (!isPasTrue) {
        req.flash('loginError', "Incorrect password");
        res.redirect('/login');
        return
    }
    const token = generateToken(findUser._id);
    res.cookie('token', token, { httpOnly: true, secure: true });
    res.redirect('/')
})

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        req.flash('registerError', "All fields are required")
        res.redirect('/register');
        return
    }
    // Check email
    const findUser = await User.findOne({ email });
    if (findUser) {
        req.flash('registerError', "Email already exists")
        res.redirect('/register');
        return
    }

    const hashPas = await bcrypt.hash(password, 10);
    const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashPas
    }
    const user = await User.create(userData);
    const token = generateToken(user._id);
    res.cookie('token', token, { httpOnly: true, secure: true });


    res.redirect('/')
});


// logout
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
})

export default router;