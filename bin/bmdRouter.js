const net = require('net')
const StringDecoder = require('string_decoder').StringDecoder
const routerText = new StringDecoder('utf8')
const server = require('../server')


bmdRouter = net.connect({
    port: 9990,
    host: ipaddr
}, () => {
    console.log('connected to router...')
})

bmdRouter.on('data', (data) => {
    if (routerText.write(data) === 'ACK') {
        console.log(routerText.write(data));
    }
    remaining += data;
    var index = remaining.indexOf('\n');
    while (index > -1) {
        var line = remaining.substring(0, index);
        remaining = remaining.substring(index + 1);
        parseData(line);
        index = remaining.indexOf('\n');
    }
})

bmdRouter.on('connect', () => {
    isOnline = true
})


bmdRouter.on('close', () => {
    isOnline =  null
    console.log('router connection closed');
});


bmdRouter.on('end', () => {
    isOnline = null
    console.log('router connection ended');
    socket.emit('bmdRouter state', {
        state: null,
        message: 'disconnected...'
    });
});


bmdRouter.on('error', () => {
    isOnline = false
    console.log('router connection error');
})

