const { log } = require("console");
const net = require(`net`);

const PORT = 7979;

const server = net.createServer((socket) => {
    const client = `${socket.remoteAddress === `::1` ? `localhost` : socket.remoteAddress}, ${socket.remotePort}`;
    socket.write(`Heyla [${client}], salve, sono io, Topolino! Allora, vi va di fare un salto nella mia casa?\r\nAh si? Grandioso, su andiamo!\r\nAhah, me l'ero quasi dimeneticato, per far apparire la mia casa dobbiamo dire la parola magica. Tiska Tuska Topolino!\r\nDiciamolo insieme: Tiska Tuska Topolinoooooooo\r\n`)
    socket.write(`> `);

    let msg = ``;
    socket.on(`data`, (data) => {
        if (data.toString().endsWith(`\n`)) {
            if (msg.toString() === `quit` || msg.toString() === `exit`) {
                socket.end();
                console.log(`Client disconnected`)
                return;
            }
            socket.write(`${msg}\r\n> `);
            msg = ``;
        } else {
            msg += data;
        }
    })
});

server.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`);
});