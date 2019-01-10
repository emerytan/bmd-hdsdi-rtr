const net = require('net')
const ipaddr = '10.208.79.51'
var ioTable = {}
var inputLabels = {}
var outputLabels = {}
var ioRegex = /(^[0-9]{1,2})\s([0-9]{1,2})/
var labelRegex = /(^[0-9]{1,2})\s(.{3,})/
var chunk = ""
var getData = "io"

const bmdRouter = net.createConnection({
        port: 9990,
        host: ipaddr
}, () => {
        console.log('connected to router...')
})

bmdRouter.on('connect', () => {
    console.log('connected')
})

bmdRouter.on('data', (data) => {
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

bmdRouter.on('error', (error) => {
    console.log(error)
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
    io.emit('io table', ioTable)
    getOutputLabels()
}, 2000)

setTimeout(() => {
    console.log(inputLabels)
    getInputLabels()
    io.emit('dest init', inputLabels)
}, 4000)

setTimeout(() => {
    console.log(outputLabels)
    io.emit('source init', outputLabels)
}, 6000)


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

module.exports = {
    ioTable,
    inputLabels,
    outputLabels
}
