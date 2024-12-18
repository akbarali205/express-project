import { Router } from 'express';
const router = Router();
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../services/token.js';
import loginMiddleware from '../middleware/login.js'

router.get('/login', loginMiddleware, (req, res) => {
    res.render('login', {
        title: 'Login | Ali',
        isLogin: true,
        loginError: req.flash('loginError'),
    })
})

router.get('/register', loginMiddleware, (req, res) => {
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
    res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
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
    res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
    res.redirect('/')
});


// logout
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
})

export default router;