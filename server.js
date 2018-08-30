const express = require('express')
const app = express()
const server = require('http').Server(app)
const net = require('net')
const io = require('socket.io')(server)
const StringDecoder = require('string_decoder').StringDecoder
const routerText = new StringDecoder('utf8')
const ipaddr = process.argv[2] || '10.0.99.50'
module.exports.ipaddr = ipaddr
const bmdRouter = require('./bmdRouter')
const sources = require('./sources')(io)
const destinations = require('./destinations')(io)
var connections = []
var remaining
var isOnline = undefined
var lastRequest = 'getOutputLabels'

app.use(express.static(__dirname + '/'))
app.use(express.static(__dirname + '/build'))
app.use(express.static(__dirname + '/src'))
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'))

server.listen(3000, () => {
	console.log('BMD router webApp listening on port 3000')
	console.log(`connecting to router @ ${ipaddr}`);
})

if (bmdRouter) {
	io.emit('bmdRouter state', {
		state: true
	})
}

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html')
})


io.on('connection', (socket) => {
	connections.push(socket)
	console.log(`server: connections = ${connections.length}`)



	socket.on('disconnect', function (socket) {
		connections.splice(connections.indexOf(socket), 1)
		console.log(`server: connections = ${connections.length}`)
	})


	if (isOnline === true) {
		console.log('sending router state')

	}


	socket.on('change request', (msg => {
		console.log('write this data to bmdRouter...')
		console.log(msg)
		if (bmdRouter) {
			bmdRouter.write(Buffer.from('VIDEO OUTPUT ROUTING:\n'))
			bmdRouter.write(Buffer.from(`${msg.dest} ${msg.source}`))
			bmdRouter.write(Buffer.from('\n\n'))
		} else {
			io.emit('server messages', 'router not connected...')
		}
	}))

	

	socket.on('get destinations', () => {
		console.log('socket - get destinations');
		lastRequest = 'getOutputLabels'
		getOutputLabels()
	})

})


bmdRouter.on('connect', () => {
	isOnline = true
})

bmdRouter.on('data', (data) => {
	console.log(data.toString());
	remaining += data
	var index = remaining.indexOf('\n')
	while (index > -1) {
		var line = remaining.substring(0, index)
		remaining = remaining.substring(index + 1)
		parseData(line)
		index = remaining.indexOf('\n')
	}
	remaining = ''

})


bmdRouter.on('close', () => {
	isOnline = false
	console.log('router connection closed')
	io.emit('bmdRouter state', {
		state: false,
		message: 'BMD router disconnected...'
	})
})


bmdRouter.on('end', () => {
	isOnline = null
	console.log('router connection ended')
	io.emit('bmdRouter state', {
		state: null,
		message: 'disconnected...'
	})
})


bmdRouter.on('error', () => {
	isOnline = false
	console.log('router connection error')
	io.emit('bmdRouter state', {
		state: false,
		message: 'BMD router connection error...'
	})
})


function parseData(data) {
	var arr = []
	var labelReg = /(^[0-9]{1,2})\s(.{3,})/
	var ioReg = /(^[0-9]{1,2})\s([0-9]{1,2})/
	if (ioReg.test(routerText.write(data))) {
		var thisMatchinfo = data
		arr = thisMatchinfo.split(' ')
		console.log(arr);
		io.emit('router change', {
			source: arr[1],
			destination: arr[0]
		})
	}


	// var thisMatchinfo = data
	// arr = thisMatchinfo.split(' ')
	// console.log(arr);


	var thisMatchinfo = routerText.write(data)
	var found = thisMatchinfo.match(labelReg)
	var currentRoutes = thisMatchinfo.match(ioReg)

	if (lastRequest === 'getInputLabels' && found !== null) {
		// console.log(`sources: key ${found[2]} value: ${found[1]}`)
		// sources[found[1]] = found[2]
	}

	if (lastRequest === 'getOutputLabels' && found !== null) {
		// console.log(`destinations:  key ${found[2]} value: ${found[1]}`)
		// destinations[found[1]] = found[2]
	}

	if (lastRequest === 'ioTable' && currentRoutes !== null) {

	}

}


function getInputLabels() {
	
}

function getOutputLabels() {

	bmdRouter.write(Buffer.from('OUTPUT LABELS:\n'))
	bmdRouter.write(Buffer.from('\n'))
}

function ioTable() {
	lastRequest = 'ioTable'
	bmdRouter.write(Buffer.from('VIDEO OUTPUT ROUTING:\n\n'))
}