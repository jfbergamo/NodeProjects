// 3- con invio (code 13)

const net = require('net');

const PORT = 7979;

const server = net.createServer((socket) => {
    socket.write("\r\n");
    let msg = "";

    socket.on('data', (data) => {
        if (data.toString().endsWith('\r\n')) {
            socket.write(`${msg}\r\n`);
            msg = "";
        } else {
            msg += data;
        }
    })
})

server.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`)
})