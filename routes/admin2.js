const express = require('express');
const router = express.Router();

router.get('/bbb/:action?/:id?', (req, res)=>{
    const {params, url, baseUrl, originalUrl}= req;

    res.json({params, url, baseUrl, originalUrl})
})
module.exports = router;