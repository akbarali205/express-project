const express = require('express');
const app = express();
const {create} = require('express-handlebars');


const hbs = create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/about', (req, res) => {
    res.render('about')
})


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})
