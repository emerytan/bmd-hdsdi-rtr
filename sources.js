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

	})
}


function parseData(data) {
	var arr = []
	var labelReg = /(^[0-9]{1,2})\s(.{3,})/
	var ioReg = /(^[0-9]{1,2})\s([0-9]{1,2})/
	var thisMatchinfo = data
	arr = thisMatchinfo.split(' ')
	console.log(arr);
	var thisMatchinfo = routerText.write(data)
	var found = thisMatchinfo.match(labelReg)
	var currentRoutes = thisMatchinfo.match(ioReg)

}