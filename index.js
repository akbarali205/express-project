import express from 'express';
import mongoose from 'mongoose';
import { create } from 'express-handlebars'
import chalk from 'chalk';
import flash from 'connect-flash';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import authTokenMid from './src/middleware/authToken.js';
import * as dotenv from 'dotenv';
import userMiddleware from './src/middleware/user.js';
import hbsHelpers from './src/hbsHelpers/index.js';
dotenv.config()


// Routers
import AuthRouter from './src/routes/auth.js';
import ProductRouter from './src/routes/products.js';

const app = express();

const hbs = create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: hbsHelpers
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser())
app.use(session({
    secret: 'akbarali', resave: false, saveUninitialized: false
}));
app.use(flash());
app.use(authTokenMid)
app.use(userMiddleware)

app.use(AuthRouter);
app.use(ProductRouter);

const PORT = process.env.PORT || 4000;

// mongoose
// mongoose.set('strictQuery', false)
// { useNewUrlParser: true }
mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log(chalk.green.bold('Connected to MongoDB'));
}).catch(err => {
    console.error(chalk.red.bold('Error connecting to MongoDB'), err);
    process.exit(1);
});

app.listen(PORT, () => {
    console.log(chalk.gray(`Server is running on port: ${PORT}`));
    console.log(chalk.gray.bgYellow('App link is'), chalk.blue.underline(`http://localhost:${PORT}`));
})