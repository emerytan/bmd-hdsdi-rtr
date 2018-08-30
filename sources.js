<<<<<<< HEAD
=======
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


>>>>>>> cad93cf183358ef84fd12b1c04e0f978b8e6e0e0
