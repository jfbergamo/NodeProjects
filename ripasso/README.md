Realizzare un server TCP con il seguente protocollo:
appena un client si connette compare un messaggio di benvenuto con cognome e nome dello sviluppatore del server
bcast <messaggio> invia un messaggio a tutti gli altri client (tranne che a se stesso); il mittente del messaggio riceve in risposta dal server il numero di client ai quali il messaggio è stato inoltrato; 
exit disconnette individualmente il client dal server, che risponde con un messaggio di avvenuta operazione, seguito dal numero di connessioni rimaste attive; il messaggio compare sia sul client che sulla console del server;
clients fornisce la lista completa di tutti i client che sono attualmente connessi al server, specificandone indirizzo ip e numero di porta;
time fornisce il numero di secondi trascorsi dall’inizio della connessione del client; suggerimento: utilizzare gli oggetti Date. Esempio:
var t0 = new Date()
...
var t1 = new Date()
var seconds = (t1.getTime() - t0.getTime())/1000
quit <ip> <port> disconnette il client con ip e porta specificati; se non esiste alcun client con quell’ip e porta, viene notificato un messaggio di errore; il client che viene disconnesso riceve un messaggio che specifica ip e porta di chi ha eseguito il quit;
msg <ip> <port> <message> invia un messaggio privato al client con ip e porta specificati
shutdown <n> disconnette n client collegati al server tranne quello che ha dato il comando, mentre il server continua a funzionare; se <n> è maggiore o uguale del numero di client attualmente connessi, tutti i client vengono disconnessi, anche quello che ha dato il comando, mentre il server rimane comunque attivo;
shutdown now disconnette tutti i client attivi e spegne il server (per disabilitare l’accettazione di nuovi client, utilizzare server.close());
cmdlist fornisce la lista dei comandi disponibili;
help <comando> fornisce la spiegazione/descrizione del comando (vale anche scrivere help help);
in tutti gli altri casi il server restituisce il numero di caratteri della stringa ricevuta dal client nella forma chars: <nchars>
