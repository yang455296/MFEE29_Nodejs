const bcrypt = require('bcryptjs');

(async()=> {
    const h = await bcrypt.hash('123456', 10);
    console.log(h);
    // hashStr的字串從上面的h複製貼上
    const hashStr = '$2a$10$w0bdzt00/HitaCCJneXV3uM8D7UtJEHJt/DpI9.hxHPkpvuHVBDaG';

    console.log(await bcrypt.compare('123456', hashStr));
})()
