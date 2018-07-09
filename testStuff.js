const net = require('net')

const bmdRouter = net.connect({
	port: 9990,
	host: '192.168.64.219'
}, () => {
	console.log('connected to router...')
})

module.exports = bmdRouter
