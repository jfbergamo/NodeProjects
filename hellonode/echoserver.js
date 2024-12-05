const { log } = require("console");
const net = require(`net`);

const PORT = 7979;

let clients = [];

const server = net.createServer((socket) => {
    const client = getClientName(socket);
    let emitter = `peer`;
    clients.push(socket);

    console.log(`Client ${client} connected`);
    socket.write(`Heyla ${client}, salve, sono io, Topolino! Allora, vi va di fare un salto nella mia casa?\r\nAh si? Grandioso, su andiamo!\r\nAhah, me l'ero quasi dimeneticato, per far apparire la mia casa dobbiamo dire la parola magica. Tiska Tuska Topolino!\r\nDiciamolo insieme: Tiska Tuska Topolinoooooooo\r\n`);
    socket.write(`> `);

    let msg = ``;
    socket.on(`data`, (data) => {
        if (data.toString().endsWith(`\r\n`)) {
            console.log(`${client} ${msg}`);

            switch (msg.toString()) {
            case `con`:
                console.log(`Displaying connected clients to ${client}`);
                socket.write(`Connected clients: ${getClientNames(clients)}\r\n`);
                break;
            case `quit`:
            case `exit`:
                emitter = `me`;
                socket.end();
                return;
            default:
                socket.write(`${msg}\r\n`);
                break;
            }
            msg = ``;
            socket.write(`> `);
        } else {
            msg += data;
        }
    })
    
    socket.on(`end`, () => {
        console.log(`Client ${client} disconnected by ${emitter}.`);
        clients.splice(clients.indexOf(socket));
    })
});

function getClientName(socket) {
    return `[${socket.remoteAddress === socket.localAddress ? `localhost` : socket.remoteAddress.toString().replace(`::ffff:`, ``)}, ${socket.remotePort}]`
}

function getClientNames(clients) {
    const names = [];
    for (client in clients) {
        names.push(getClientName(client));
    }
    return names;
}

server.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`);
});