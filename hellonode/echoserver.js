const { log } = require("console");
const net = require(`net`);

const PORT = 7979;

const server = net.createServer((socket) => {
    const client = `[${socket.remoteAddress === socket.localAddress ? `localhost` : socket.remoteAddress.toString().replace(`::ffff:`, ``)}, ${socket.remotePort}]`;
    
    console.log(`Client ${client} connected`)

    socket.write(`Heyla ${client}, salve, sono io, Topolino! Allora, vi va di fare un salto nella mia casa?\r\nAh si? Grandioso, su andiamo!\r\nAhah, me l'ero quasi dimeneticato, per far apparire la mia casa dobbiamo dire la parola magica. Tiska Tuska Topolino!\r\nDiciamolo insieme: Tiska Tuska Topolinoooooooo\r\n`)
    socket.write(`> `);

    let msg = ``;
    socket.on(`data`, (data) => {
        if (data.toString().endsWith(`\n`)) {
            console.log(`${client} ${msg}`)

            if (msg.toString() === `quit` || msg.toString() === `exit`) {
                socket.emit(`close`);
                return;
            }
            socket.write(`${msg}\r\n> `);

            msg = ``;
        } else {
            msg += data;
        }
    })
    
    socket.on(`close`, () => {
        socket.write(`Goodbye`);
        socket.end();
    })
    
    socket.on(`end`, () => {
        console.log(`Client ${client} disconnected`)
    })
});

server.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`);
});