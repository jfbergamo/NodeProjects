const events = require('events')

const emitter = new events.EventEmitter();

emitter.on('pippo', (data) => {
    console.log(data);
});

emitter.emit('pippo', 69);