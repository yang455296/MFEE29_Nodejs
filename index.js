require('dotenv').config();
const { urlencoded } = require('express');
const express = require('express');

const app = express();

app.set('view engine', 'ejs'); //ejs

// top-level middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//routes
//  get只允許get的方法, use都可以
app.get('/', (req, res)=>{
    res.render('main', {name: 'Shinder'});
}); //根目錄  //ejs  name變成變數到main.ejs裡

app.get('/sales-json', (req, res)=>{
    const sales = require(__dirname+'/data/sales');
    console.log(sales);
    res.render(`sales-json`, {sales});
});

app.get('/json-test', (req, res)=>{
    res.send({name: 'Shinder', age:30});
    // res.json({name: 'Shinder', age:30});
});

app.get('/try-qs', (req, res) => {
    res.json(req.query);
});


app.post('/try-post', (req, res) => {
    res.json(req.body);
}); // http://localhost:3001/try-post無畫面, 使用postman

app.get('/try-post-form', (req, res) => {
    res.render('try-post-form');
});
app.post('/try-post-form', (req, res) => {
    res.render('try-post-form', req.body);
});


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