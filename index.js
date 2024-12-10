import express from 'express';
const app = express();
import {create} from 'express-handlebars'
import chalk from 'chalk';
import AuthRouter from './routes/auth.js';
import ProductRouter from './routes/products.js';


const hbs = create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(AuthRouter);
app.use(ProductRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    console.log(chalk.gray.bgYellow('App link is'), chalk.blue.underline(`http://localhost:${PORT}`));
})