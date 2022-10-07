const express = require('express');

const app = express();

app.get('/', (req, res)=>{
    res.send(`<h2>hello</h2>`);
})

app.listen(3000, ()=>{
    console.log('server start')
})