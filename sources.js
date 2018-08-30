const bmdRouter = require('./bmdRouter')

module.exports = (io) => {
	io.on('connection', (socket) => {
		console.log('sources socket io working...')

		socket.emit('server messages', 'sources.js running')

		socket.on('get sources', () => {
			console.log('socket - get sources');
			lastRequest = 'getInputLabels'
			bmdRouter.write(Buffer.from('INPUT LABELS:\n'))
			bmdRouter.write(Buffer.from('\n'))
		})

	})
}


