// 5- con ‘quit’ - “client disconnected”

const net = require('net');

const PORT = 7979;

const endl = "\r\n"

const server = net.createServer((socket) => {
    const client_addr = `[${socket.remoteAddress === socket.localAddress ? 'localhost' : socket.remoteAddress}:${socket.remotePort}]`;
    
    socket.write(`Benvenuto, ${client_addr}${endl}> `);
    let msg = "";

    let chiusore = "peer";

    socket.on('data', (data) => {
        if (data.toString().endsWith(endl)) {
            switch (msg) {
                case 'quit':
                    chiusore = "me";
                    socket.end();
                    break;
                default:
                    socket.write(`${msg}${endl}> `);
                break;
            }
            msg = "";
        } else {
            msg += data;
        }
    })

    socket.on('end', () => {
        console.log(`Client ${client_addr} disconnected by ${chiusore}...`);
    })
})

server.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`)
})