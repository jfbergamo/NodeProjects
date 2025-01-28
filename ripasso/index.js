const net = require('net');

const PORT = 7979;

const server = net.createServer((socket) => {
    server.clients.push(socket);
    let msg = "";

    const connection_time = new Date();

    socket.write("Bergamasco Jacopo\r\n");

    socket.on('data', (data) => {
        msg += data;
        if (msg.endsWith('\r\n')) {
            if (msg.startsWith(`bcast`)) {
                if (msg.split(' ').length < 2) {
                    socket.write('[ERROR] Not enough arguments! Code: 104, diploma not found\r\n');
                } else {
                    server.emit("broadcast", msg.slice('bcast'.length + 1), socket);
                }
            } else if (msg.startsWith(`exit`)) {
                if (msg.split(' ').length > 1) {
                    socket.write('[ERROR] Too many arguments! Code: 104, diploma not found\r\n');
                } else {
                    server.clients.splice(server.clients.indexOf(socket), 1);
                    const msg = `Disconnessione dal server avvenuta con successo! Client connessi: ${server.clients.length}\r\n`;
                    socket.write(msg);
                    console.log(msg);
                    socket.end();
                }
            } else if (msg.startsWith(`clients`)) {
                if (msg.split(' ').length > 1) {
                    socket.write('[ERROR] Too many arguments! Code: 104, diploma not found\r\n');
                } else {
                    socket.write('[')
                    server.clients.forEach((client, i) => {
                        if (i != 0) socket.write(',')
                            socket.write(` (${client.remoteAddress} ${client.remotePort}) `)
                    });
                    socket.write(']\r\n');
                }
            } else if (msg.startsWith(`time`)) {
                if (msg.split(' ').length > 1) {
                    socket.write('[ERROR] Too many arguments! Code: 104, diploma not found\r\n');
                } else {
                    socket.write(`Tempo trascorso: ${(new Date().getTime() - connection_time.getTime())/1000}s\r\n`);
                }
            } else if (msg.startsWith(`quit`)) {
                const args = msg.split(' ');
                if (args.length < 3) {
                    socket.write('[ERROR] Not enough arguments! Code: 104, diploma not found\r\n');
                } else {
                    const ip = args[1];
                    const port = args[2].replace('\r\n', '');
                    const client = findClient(ip, port);
                    if (client !== null) {
                        server.clients.splice(server.clients.indexOf(socket), 1);
                        client.end();
                        socket.write('Obliterated\r\n');
                    } else {
                        socket.write('[ERROR] Client not found! Code: 69, sex not applied\r\n');
                    }
                }
            } else if (msg.startsWith(`msg`)) {
                const args = msg.split(' ');
                if (args.length < 4) {
                    socket.write('[ERROR] Not enough arguments! Code: 104, diploma not found\r\n');
                } else {
                    const ip = args[1];
                    const port = args[2];
                    const message = msg.slice(`msg ${ip} ${port} `.length);
                    const client = findClient(ip, port);
                    if (client !== null) {
                        client.write(message);
                    } else {
                        socket.write('[ERROR] Client not found! Code: 69, sex not applied\r\n');
                    }
                }
            } else if (msg.startsWith(`shutdown`)) {
                const args = msg.split(' ');
                if (args.length > 2) {
                    socket.write('[ERROR] Too many arguments! Code: 104, diploma not found\r\n');
                } else {
                    const arg = args[1].replace('\r\n', '');
                    if (arg == 'now') {
                        server.shutdown(server.clients.length, socket);
                        server.close();
                    } else if (parseInt(arg) !== NaN) {
                        server.shutdown(arg, socket);
                    } else {
                        socket.write('[ERROR] Wrond command syntax! Code: 420, you on drugs\r\n');
                    }
                }
            } else {
                socket.write(msg);
            }
            msg = "";
        }
    });

});

server.clients = [];

server.on('broadcast', (msg, emitter) => {
    server.clients.forEach((client) => {
        if (client !== emitter) {
            client.write(msg);
        } else {
        client.write(`Messaggio inviato a ${server.clients.length - 1} client.\r\n`);
        }
    });
});

server.shutdown = (n, emitter) => {
    let i = 0;
    
    for (client of server.clients) {
        if (n >= server.clients.length || client !== emitter) {
            client.end();
            i++;
        }
        if (i >= n) break;
    }
};

function findClient(ip, port) {
    for (let client of server.clients) {
        if (client.remoteAddress == ip && client.remotePort == port) {
            return client;
        }
    }
    return null;
}

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
})