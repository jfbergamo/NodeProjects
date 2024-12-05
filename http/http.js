const http = require(`http`);

const ADDR = `localhost`
const PORT = 7979

const server = http.createServer(async (req, res) => {
    switch (req.url) {
        default:
            res.setHeader(`Content-Type`, `text/html`);
            res.end("<h1>Ciao<h1>");
            break;
    }
})

server.listen((ADDR, PORT), () => {
    console.log(`worka`);
})