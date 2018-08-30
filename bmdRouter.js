const net = require('net')
const ipaddr = require('./server').ipaddr

console.log(ipaddr);

const bmdRouter = net.connect({
	port: 9990,
	host: ipaddr
}, () => {
	console.log('connected to router...')
})

module.exports = bmdRouter
