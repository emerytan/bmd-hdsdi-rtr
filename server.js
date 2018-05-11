const express = require('express')
const app = express()
const server = require('http').Server(app)
const net = require('net')
const path = require('path')
const fs = require('fs')
const EventEmitter = require('events').EventEmitter
const spawn = require('child_process').spawn
const io = require('socket.io')(server)
const sources = require('./bin/objectifySources')
const destinations = require('./bin/objectifyDestinations')
const StringDecoder = require('string_decoder').StringDecoder
const routerText = new StringDecoder('utf8')
const ipaddr = '10.0.99.50'
var bmdRouter
var connections = []
var remaining
var ioReg = /^[0-9]{1,2}\s[0-9]{1,2}/gm
var isOnline = undefined


app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/build'));
app.use(express.static(__dirname + '/src'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'))

server.listen(3000, (err) => {
    console.log('BMD router webApp listening on port 3000')
})

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html')
});


io.on('connection', (socket) => {
    connections.push(socket)
    console.log(`server: connections = ${connections.length}`)
    socket.emit('dest init', destinations)
    io.emit('bmdRouter state', {
        state: isOnline
    })


    console.log('source init');
    socket.emit('source init', sources)  


    socket.on('disconnect', function (socket) {
        connections.splice(connections.indexOf(socket), 1);
        console.log(`server: connections = ${connections.length}`);
    });


    if (isOnline) {
        console.log('requesting io table');
        bmdRouter.write(Buffer.from('VIDEO OUTPUT ROUTING:\n\n'))
    }


    socket.on('change request', (msg => {
        console.log('write this data to bmdRouter...')
        console.log(msg)
        if (bmdRouter) {
            bmdRouter.write(Buffer.from('VIDEO OUTPUT ROUTING:\n'))
            bmdRouter.write(Buffer.from(`${msg.dest} ${msg.source}`))
            bmdRouter.write(Buffer.from('\n\n'))
        } else {
            io.emit('server messages', "router not connected...")
        }
    }))
})


function routerInit() {
    bmdRouter = net.connect({
        port: 9990,
        host: ipaddr
    }, (c) => {
        console.log('connected to router...')
    })

    bmdRouter.on('connect', () => {
        isOnline = true
        io.emit('bmdRouter state', {
            state: isOnline
        })
    })

    bmdRouter.on('data', (data) => {
        remaining += data;
        var index = remaining.indexOf('\n');
        while (index > -1) {
            var line = remaining.substring(0, index);
            remaining = remaining.substring(index + 1);
            parseData(line);
            index = remaining.indexOf('\n');
        }
        remaining = ''
    })


    bmdRouter.on('close', () => {
        isOnline = false
        console.log('router connection closed');
        io.emit('bmdRouter state', {
            state: false,
            message: 'BMD router disconnected...'
        });
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
        io.emit('bmdRouter state', {
            state: false,
            message: 'BMD router connection error...'
        });
    })
}


function parseData(data) {
    var ioReg = /^[0-9]{1,2}\s[0-9]{1,2}$/g;
    if (ioReg.test(routerText.write(data))) {
        var thisMatchinfo = data
        var arr = thisMatchinfo.split(" ");
        io.emit('router change', {
            source: arr[1],
            destination: arr[0]
        })
    }
}


function func(data) {
    console.log(`Line: ${data}`);
}

