const express = require('express');
const path = require('path');
const app = express();


app.get('/', (req, res) => {
    res.status(200);
    res.sendFile(path.join(__dirname, 'views/index.html'));
})

app.get('/about', (req, res) => {
    res.status(200);
    res.sendFile(path.join(__dirname, 'views/about.html'));
})


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})
