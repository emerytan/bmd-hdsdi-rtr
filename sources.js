const io = require('./server')
var isGood

io.on('connection', (socket) => {
  isGood = true
})

module.exports.isGood = isGood

