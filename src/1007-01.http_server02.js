const http = require('http');
const fs = require('fs').promises;

const server = http.createServer((req, res)=>{

    fs.writeFile(__dirname+'/headers.txt',JSON.stringify(req.headers))
    .then(data=>{
        console.log({data})
        // {data}  "data:"data
    })

    res.writeHead(200, {
        'Content-Type':'text/html'
    });
    res.end(`<h2>${req.url}</h2>`)
});
server.listen(3000)

// terminal: npx nodemon src\1007-01.http_server02.js
// http://localhost:3000/