// Bergamasco Jacopo, 5AIA, A.S. 2024-2025

const net = require('net');

const PORT = 7979;
const dev = 'Bergamasco Jacopo';
const endl = '\r\n';

const server = net.createServer((socket) => {
    // Init
    server.sockets.push(socket);
    socket.clientAddr = {
        'ip': (() => {
            const addr = socket.remoteAddress;
            return (addr === socket.localAddress ? 'localhost' : addr.toString());
        })(),
        'port': socket.remotePort,
    };
    socket.name = () => {
        return `${socket.clientAddr.ip}:${socket.clientAddr.port}`;
    };
    socket.loginTime = new Date();
    socket.write(`${dev}${endl}> `)
    let input = '';

    // Events
    
    server.on('broadcast', (msg) => {
        server.sockets.forEach((sock) => {
            sock.write(`[${socket.name()}] ${msg}${endl}> `);
        });
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
                case 'clients':
                    socket.write(`${server.getNames().toString()}${endl}> `);
                    break;
                case 'time':
                    socket.write(`Tempo trascorso: ${(new Date().getTime() - socket.loginTime.getTime())/1000}s${endl}> `);
                    break;
                case 'quit':
                    if (args.length == 0) {
                        socket.emit('close');
                        return;
                    } else if (args.length != 2) {
                        socket.write(`[ERRORE] Sintassi: quit <ip> <port>`);
                    } else {
                        server.emit('kick', args[0], args[1]);
                    }
                    break;
                case 'exit':
                    socket.emit('close');
                    return;
                default:
                    console.log(`[${socket.name()}] ${input}`)
                    socket.write(`${input}${endl}> `);
                    break;
                }
            input = '';
        } else {
            input += data;
        }
    });
    
    socket.on('close', () => {
        server.sockets.splice(server.sockets.indexOf(socket), 1);
        const message = `Disconnessione [${socket.name()}] in corso. Client connessi: ${server.sockets.length}.`;
        socket.write(message);
        socket.end();
        console.log(message);
    });

    server.on('kick', (ip, port) => {
        console.log(`quit ${ip} ${port}`)
        server.sockets.forEach((sock) => {
            if (sock.clientAddr.ip === ip && sock.clientAddr.port === port) {
                sock.emit('end');
                return;
            }
        })
    });
});

server.sockets = [];
server.getNames = () => {
    const names = [];
    server.sockets.forEach((sock) => {
        names.push(`[${sock.clientAddr.ip}:${sock.clientAddr.port}]`);
    });
    return names;
};

server.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`)
});