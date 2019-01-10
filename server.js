const express = require('express')
const app = express()
const server = require('http').Server(app)
const net = require('net')
const io = require('socket.io')(server)
const StringDecoder = require('string_decoder').StringDecoder
const routerText = new StringDecoder('utf8')
const ipaddr = process.argv[2] || '10.208.79.51'
var connections = []
var isOnline = undefined
var ioTable = {}
var inputLabels = {}
var outputLabels = {}
var ioRegex = /(^[0-9]{1,2})\s([0-9]{1,2})/
var labelRegex = /(^[0-9]{1,2})\s(.{3,})/
var chunk = ""
var getData = "io"

app.use(express.static(__dirname + '/'))
app.use(express.static(__dirname + '/build'))


server.listen(3000, () => {
	console.log('BMD router webApp listening on port 3000')
	console.log(`connecting to router @ ${ipaddr}`);
})


const bmdRouter = net.createConnection({
	port: 9990,
	host: ipaddr
}, () => {
	console.log('connected to router...')
})

bmdRouter.on('connect', () => {
	isOnline = true
})

bmdRouter.on('data', (data) => {

	console.log(routerText.write(data));

	chunk += data.toString()
	var index = chunk.indexOf('\n')
	while (index > -1) {
		var line = chunk.substring(0, index)
		parseData(line)
		chunk = chunk.substring(index + 1)
		index = chunk.indexOf('\n')
	}
	chunk = ''
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


function parseData(z) {
	var ioarr = ioRegex.exec(z)
	var labelArr = labelRegex.exec(z)
	if (getData === "io" && ioarr !== null) ioTable[ioarr[1]] = ioarr[2]
	if (getData === "input" && labelArr !== null) inputLabels[labelArr[1]] = labelArr[2]
	if (getData === "output" && labelArr !== null) outputLabels[labelArr[1]] = labelArr[2]
}


setTimeout(() => {
	console.log(ioTable)
	getInputLabels()
}, 2000)

setTimeout(() => {
	console.log('input labels')
	getOutputLabels()
}, 3000)

setTimeout(() => {
	console.log('output labels')
}, 4000)


function getInputLabels() {
	getData = "input"
	bmdRouter.write(Buffer.from('INPUT LABELS:\n'))
	bmdRouter.write(Buffer.from('\n'))
}

function getOutputLabels() {
	getData = "output"
	bmdRouter.write(Buffer.from('OUTPUT LABELS:\n'))
	bmdRouter.write(Buffer.from('\n'))
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
	
	socket.on('get sources', () => {
		console.log('socket - get sources');
		socket.emit('source init', {
			inputLabels,
			ioTable
		})
	})
	
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
		socket.emit('dest init', outputLabels)
	})

})

