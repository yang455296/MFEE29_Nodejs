const express = require('express');
const router = express.Router();
const db = require(__dirname+"/../modules/db_connect2");
const upload = require(__dirname + '/../modules/upload-img');

router.use((req, res, next)=>{
    if(req.session.admin && req.session.admin.account){
        next();
    } else {
        res.status(403).send('無權訪問');
    }
})

async function getListData(req, res){
    const perPage = 10;
    let page = +req.query.page || 1;
    if(page<1){
        return res.redirect(req.baseUrl); // api不應該轉向
    }

    let search = req.query.search ? req.query.search.trim() : '';
    let where = ` WHERE 1 `;
    if(search) {
        where += ` AND 
        (
            \`name\` LIKE ${db.escape('%'+search+'%')}
            OR
            \`address\` LIKE ${db.escape('%'+search+'%')}
        ) `;
    }

    const t_sql = `SELECT COUNT(1) totalRows FROM address_book ${where}`;
    const [[{totalRows}]] = await db.query(t_sql);

    let totalPages = 0;
    let rows = [];
    if(totalRows>0){
        totalPages = Math.ceil(totalRows/perPage);
        if(page>totalPages) {
            return res.redirect(`?page=${totalPages}`);
        }
        const sql = `SELECT * FROM address_book ${where} ORDER BY sid DESC LIMIT ${(page-1)*perPage}, ${perPage} `;
        [rows] = await db.query(sql);
    }
    return {totalRows, totalPages, perPage, page, rows, search, query: req.query};
}

// CRUD

router.get('/add', async (req, res)=>{
    res.locals.title = '新增資料 | ' + res.locals.title;
    res.render('address-book/add')
    //新增資料
});
router.post('/add', upload.none(), async (req, res)=>{
    // res.json(req.body);
    const output = {
        success: false,
        code: 0,
        error: {},
        postData: req.body//除錯用
    }
    //TODO: 檢查欄位的格式,可以用npm joi
    const sql = "INSERT INTO `address_book`( `name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES (?,?,?,?,?, NOW())";

    const [result] = await db.query(sql, [
        req.body.name,
        req.body.email,
        req.body.mobile,
        req.body.birthday || null,
        req.body.address,
    ]);

    if (result.affectedRows) output.success = true;
    res.json(output)

});

//修改資料
router.get('/edit/:sid', async (req, res)=>{
    const sql = "SELECT * FROM address_book WHERE sid=? ";
    const [rows] = await db.query(sql, [req.params.sid]);
    if(!rows || !rows.length){
        return res.redirect(req.baseUrl); //跳轉回列表頁
    }
    res.render('address-book/edit', rows[0]);
})

router.put('/edit/:sid', async (req, res)=>{
    const output = {
        success: false,
        code: 0,
        error: {},
        postData: req.body//除錯用
    }
    //TODO: 檢查欄位的格式,可以用npm joi
    const sql = "UPDATE `address_book` SET `name`=?,`email`=?,`mobile`=?,`birthday`=?,`address`=? WHERE `sid`=?";

    const [result] = await db.query(sql, [
        req.body.name,
        req.body.email,
        req.body.mobile,
        req.body.birthday || null,
        req.body.address,
        req.params.sid
    ]);

    // console.log(result);
    // if(result.affectedRows) output.success = true;
    if (result.changedRows) output.success = true;
    res.json(output)
})

router.delete('/del/:sid', async (req, res)=>{
    const sql = "DELETE FROM address_book WHERE sid=? ";
    const [result] = await db.query(sql, [req.params.sid]);
    
    res.json({success: !!result.affectedRows, result });
})



router.get('/item/:id', async (req, res)=>{
    //讀取單筆資料
});


router.get(['/', '/list'], async (req, res)=>{
    const data = await getListData(req, res);
    res.render('address-book/list', data);
});

router.get(['/api', '/api/list'], async (req, res)=>{
    res.json(await getListData(req ,res));
});

/*  //上面用async function getListData(req)改寫前
router.get(['/', '/list'],async (req, res)=>{
    const perPage = 10;
    let page = +req.query.page || 1; // + 字串轉換成數字
    if(page<1){
        return req.redirect(req.baseUrl);
    }

    let search = req.query.search ? req.query.search.trim() : '';
    let where = `WHERE 1 `;
    if (search) {
        where += `AND 
        (
            \`name\` LIKE ${db.escape('%'+search+'%')}
            OR
            \`address\` LIKE ${db.escape('%'+search+'%')}
        )`;
    } 
    // res.type('text/plain; charset=utf-8')
    // return res.end(where)

    const t_sql = `SELECT COUNT(1) totalRows FROM address_book ${where}`;
    const [[{totalRows}]] = await db.query(t_sql);

    let totalPages = 0;
    let rows = [];
    if(totalRows>0){
        totalPages = Math.ceil(totalRows/perPage)
        if(page>totalPages){
            return res.redirect(`?page=${totalPages}`)
        }
        const sql = `SELECT * FROM address_book ${where} ORDER BY sid DESC LIMIT ${(page-1)*perPage}, ${perPage}`;
        [rows] = await db.query(sql);
    }

    // res.json({totalRows, totalPages, perPage, page, rows})
    res.render('address-book/list', {totalRows, totalPages, perPage, page, rows, search, query: req.query})
})
*/
module.exports = router;