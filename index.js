require('dotenv').config();
const express = require('express');

const app = express();

app.set('view engine', 'ejs'); //ejs

// 在根目錄前執行
// app.get('/1011-01.a.html', (req, res)=>{
//     res.send(`<h2>hello</h2>`);
// }) 

//routes

app.get('/json-test', (req, res)=>{
    res.send({name: 'Shinder', age:30});
    // res.json({name: 'Shinder', age:30});
}) 

//  get只允許get的方法, use都可以
app.get('/', (req, res)=>{
    res.render('main', {name: 'Shinder'});
}) //ejs  name變成變數到main.ejs裡

app.get('/', (req, res)=>{
    res.send(`<h2>hello index</h2>`);
}) //根目錄

app.get('/abc', (req, res)=>{
    res.send(`<h2>abc</h2>`);
})

app.use(express.static('public')); // 靜態資料夾設定
app.use(express.static('node_modules/bootstrap/dist'));
//C:\Users\User\Desktop\nodejs\node_modules\bootstrap\dist\css\bootstrap.css

app.use((req, res)=>{
    // res.type('text/plain'); //純文字
    // res.status(404).send('<h3>找不到你要的頁面</h3>');
    res.status(404).render('404');
}) // 404頁面設定

const port = process.env.SERVER_PORT || 3002;
app.listen(port, ()=>{
    console.log(`server started, port: ${port}`)
})