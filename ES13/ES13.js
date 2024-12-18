// Bergamasco Jacopo, 5AIA, A.S. 2024-2025

const net = require('net');

const PORT = 7979;
const dev = 'Bergamasco Jacopo';
const endl = '\r\n';

const server = net.createServer((socket) => {
    // Init
    server.sockets.push(socket);
    socket.write(`${dev}${endl}> `)
    let input = '';

    // Events
    
    server.on('broadcast', (msg) => {
        for (sock of server.sockets) {
            sock.write(`${msg}${endl}> `);
        }
    });
    
     socket.on('data', (data) => {
        if (data == endl) {
            input = input.trim();
            let args = input.toLowerCase().split(' ');
            let cmd = args.splice(0, 1).toString();
            switch (cmd) {
                case 'bcast':
                    server.emit('broadcast', args);
                    break;
                    case 'exit':
                        socket.emit('disconnect');
                        return;
                default:
                    socket.write(`${input}${endl}> `);
                    break;
                }
            input = '';
        } else {
            input += data;
        }
    });
    
    socket.on('disconnect', () => {
        server.sockets.splice(server.sockets.indexOf(socket));
        const message = `Disconnessione client in corso. Client connessi: ${server.sockets.length}.`;
        socket.write(message);
        socket.end();
        console.log(message);
    })
});

server.sockets = [];

server.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`)
});