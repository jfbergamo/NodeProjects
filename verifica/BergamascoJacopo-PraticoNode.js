// Bergamasco Jacopo, 5AIA, A.S. 2024-2025, 29/01/2025
// Verifica Pratica Node.js

const net = require('net');

// --------- COSTANTI ---------
const PORT = 7979;
const SALDO_INIZIALE = 5;

// --------- LOGICA PRINCIPALE ---------

let globalID = 0; // Variabile autoincrementale per assegnare ID univoci ai client

const server = net.createServer((socket) => {
    // Inizializzazione parametri client
    let msg = '';
    socket.id = ++globalID;
    socket.credit = SALDO_INIZIALE;
    socket.connected = true;
    socket.connection_time = new Date();
    server.clients.push(socket);
    socket.account = [];
    
    socket.write(`Benvenuto!\r\n`);

    socket.on('data', (data) => {
        if (data == '\r\n') {
            const args = msg.trim().split(' '); // Suddivide il comando nei suoi parametri
            if (args[0] == 'info') { // Logica del comando `info`
                socket.write(`${server.getClientInfo(socket)}\r\n`);
            } else if (args[0] == 'exit') { // Logica del comando `exit`
                socket.end();
            } else if (args[0] == 'credit') { // Logica del comando `credit`
                socket.write(`Credito residuo: EUR ${socket.credit}\r\n`);
            } else if (args[0] == 'list') { // Logica del comando `list`
                socket.write(`Client connessi:\r\n`)
                server.clients.forEach((client) => {
                    socket.write(`\t${server.getClientInfo(client)}\r\n`);
                });
            } else if (parseInt(args[0])) { // Logica dei messaggi, se il primo parametro e' un numero lo usa come id del client
                if (args.length < 2) { // Controllo sul numero dei parametri
                    socket.write(`ERRORE: Troppi pochi parametri nel comando: <clientid> <message>.\r\n`);
                } else {
                    const message = msg.slice(`${args[0]} `.length); // Compone il messaggio
                    // Logica per trovare il client dall'id
                    const client = server.clients.find((client) => client.id == args[0]);
                    if (client !== undefined) {
                        
                        // Costo operazione = EUR 0.1 * LenMessaggio
                        const cost = 0.1*message.length;
                        server.pay(socket, cost, () => {
                            // Invio del messaggio
                            client.write(`${message}\r\n`);
                            // Registrazione della transazione nell'acconto del client
                            socket.account.push({
                                importo: -1*cost,
                                client: client.id
                            });
                        });

                    } else {
                        socket.write(`ERRORE: Il client richiesto non esiste o non e' piu' connesso!`);
                    }
                }
            } else if (args[0] == 'bcast') { // Logica del comando `bcast`
                if (args.length < 2) {
                    socket.write(`ERRORE: Troppi pochi parametri nel comando: bcast <message>.\r\n`);
                } else {

                    const message = msg.slice(`${args[0]} `.length);
                    const destinatari = server.clients.length - 1; // -1 perche' non contiamo il mittente

                    // Costo operazione = EUR 0.1 * LenMessaggio * Destinatari
                    const cost = 0.1*message.length*destinatari;
                    server.pay(socket, cost, () => {
                        // Esecuzione del broadcast a tutti tranne che al mittente
                        server.clients.forEach(client => {
                            if (client !== socket) {
                                client.write(`${message}\r\n`);
                            }
                        })
                        // Registrazione della transazione nell'acconto del client
                        socket.account.push({
                            importo: -1*cost,
                            client: 'bcast'
                        });
                    });
                }
            } else if (args[0] == 'recharge') {
                if (args.length != 3) {
                    socket.write(`ERRORE: Numero sbagliato di parametri nel comando: recharge <clientid> <euro>.\r\n`);
                } else {
                    const client = server.clients.find((client) => client.id == args[1]);
                    if (client !== undefined) {

                        const payment = parseFloat(args[2]);
                        if (payment) {
                            server.pay(socket, payment, () => {
                                // Aumento del credito al destinatario
                                client.credit += payment;
                                client.write(`Il tuo credito e' stato ricaricato di EUR ${payment}.\r\n`);
                                // Registrazione della transazione nell'acconto del destinatario
                                client.account.push({
                                    importo: payment,
                                    client: socket.id
                                });
                                socket.write(`Transazione avvenuta con successo.\r\n`);
                                // Registrazione della transazione nell'acconto del client
                                socket.account.push({
                                    importo: -1*payment,
                                    client: client.id
                                });
                            });
                        } else {
                            socket.write(`ERRORE: Inserire un numero valido!`);
                        }
                    } else {
                        socket.write(`ERRORE: Il client richiesto non esiste o non e' piu' connesso!`);
                    }
                }
            } else if (args[0] == 'account') { // Logica del comando `account`
                socket.write(`Elenco transazioni:\r\n`);
                socket.account.forEach((transaction) => {
                    socket.write(`\tImporto: EUR ${transaction.importo}, Client coinvolti: ${transaction.client}\r\n`);
                });
            } else {
                socket.write(`Comando sconosciuto!\r\n`);
            }

            msg = '' // "Svuota il buffer" del messaggio
        } else {
            // Se il messaggio non contiene il carattere newline continua a comporre il messaggio
            msg += data;
        }
    });

    socket.on('end', () => { // Rimuove il server dalla lista se viene disconnesso
        server.clients.splice(server.clients.indexOf(socket), 1);
    })
});

server.clients = []; // La lista dei client connessi e' una proprieta' del server.

// --------- FUNZIONI AUSILIARIE ---------

// Ottiene le informazioni del socket, quali ID, indirizzo IP, porta e tempo di connessione
// Ritorna una stringa con le informazioni del client in formato `<ID> -> <IP>:<PORTA>, <tempo di connessione>`
// Usato per `info` e per `list`
server.getClientInfo = (socket) => {
    return `${socket.id} -> ${socket.remoteAddress}:${socket.remotePort}, ${(new Date().getTime() - socket.connection_time.getTime())/1000}s`
}

// Funzione per eseguire una qualsiasi transazione
// Controlla in automatico se si ha abbastanza credito per l'operazione
// Se non si ha abbastanza credito avvisa il client e non esegue l'operazione
// Se si ha abbastanza credito avvisa il client ed esegue l'operazione dalla funzione definita
// In questo modo non si deve controllare il credito in automatico
server.pay = (socket, cost, operazione) => {
    if (socket.credit >= cost) {
        socket.write(`Costo operazione: EUR ${cost}\r\n`)
        operazione(); // La funzione di callback viene dichiarata in base al tipo di operazione da effettuare
        socket.credit -= cost;
    } else {
        socket.write(`ATTENZIONE: Non disponi di abbastanza credito per eseguire l'operazione!\r\n`);
    }
}

/////////////////////////////////////////////////////////////////

server.listen(PORT, () => { // Avvia il server
    console.log(`Server avviato e in ascolto su ${PORT}...`)
})

// eof