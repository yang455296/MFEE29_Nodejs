require('dotenv').config();
const express = require('express');
const session = require('express-session');
const moment = require('moment-timezone');
const db = require(__dirname+'/modules/db_connect2')
// const multer = require('multer');
// const upload = multer({dest: 'tmp_uplaods/'});
const upload = require(__dirname+'/modules/upload-img');
const fs = require('fs').promises;

const app = express();

app.set('view engine', 'ejs'); //ejs

// top-level middleware
app.use(session({
    saveUninitialized: false,
    // 新用戶沒有使用到 session 物件時不會建立 session 和發送 cookie
    resave: false, // 沒變更內容是否強制回存
    secret: "321ewewer", //亂碼隨意給
    cookie: {
        maxAge: 1_200_000, //_方便確認位數 20min=1200sec=1200_000msec
    },
}));
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


app.post('/try-upload', upload.single('avatar'), async (req, res) => {
    res.json(req.file);
    /*
    if(req.file && req.file.originalname){
        await fs.rename(req.file.path, `public/imgs/${req.file.originalname}`);
        res.json(req.file);
    } else {
        res.json({msg:'沒有上傳檔案'})
    }
    */
    //async await或callback function
    //fs.rename 搬到新的位置
});

app.post('/try-upload2', upload.array('photos'), async (req, res) => {
    res.json(req.files);

});


app.get('/my-params1/:action?/:id?', (req, res)=>{
    res.json(req.params);
}); 
// /my-params1/:action/:id'
// :action, :id  一定要給值
// :action?, :id?不一定要給值

app.get(/^\/m\/09\d{2}\-?\d{3}\-?\d{3}$/i, (req, res)=>{
    let u =req.url.slice(3); //去掉/m/
    u= u.split('?')[0]; //去掉query string 最後的?
    u= u.split('-').join('');
    res.json({mobile: u});
}); 

app.use('/admin2', require(__dirname+'/routes/admin2'))

const myMiddle = (req, res, next)=>{
    res.locals = {...res.local, shinder:'hello', shinder2:'hello2'}
    res.locals.derrrr = 567;
    // res.myPersonal = {...res.local, shinder:'hello'} //自己取名'myPersonal'不建議

    next();
}; // req, res會往下傳遞

// myMiddle可包可不包[]
app.get('/try-middle', [myMiddle], (req, res)=>{
    res.json(res.locals);
});

app.get('/try-session', (req, res)=>{
    req.session.aaa ||= 0; //預設值
    req.session.aaa++;
    res.json(req.session);
});

app.get('/try-date', (req, res)=>{
    // const now = new Date;
    const fm = 'YYYY/MM/DD HH:mm:ss'; //想要輸出的格式
    const m = moment('06/10/22', 'DD/MM/YY'); //原始的資料
    // const n = moment('06/10/22', 'MM/DD/YY');
    res.send({
            m,
            m1: m.format(fm),
            m2: m.tz('Europe/London').format(fm),
    //     t1: now,
    //     t2: now.toString(),
    //     t3: now.toDateString(),
    //     t4: now.toLocaleDateString(),
    //     m: m.format('YYYY-MM-DD HH:mm:ss')
    })//t1~t4直接用不好用,改用moment.js
});

app.get('/try-db', async (req, res)=>{
    const [rows] = await db.query("SELECT * FROM `address_book` LIMIT 5");
    res.json(rows);
});

// --------------------------------------------------
app.use(express.static('public')); // 靜態資料夾設定
app.use(express.static('node_modules/bootstrap/dist'));
//C:\Users\User\Desktop\nodejs\node_modules\bootstrap\dist\css\bootstrap.css
// --------------------------------------------------

app.use((req, res)=>{
    // res.type('text/plain'); //純文字
    // res.status(404).send('<h3>找不到你要的頁面</h3>');
    res.status(404).render('404'); //圖片404.webp
}) // 404頁面設定

const port = process.env.SERVER_PORT || 3002;
app.listen(port, ()=>{
    console.log(`server started, port: ${port}`)
})