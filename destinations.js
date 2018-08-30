module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('destinations socke io initialized...')
        socket.emit('server messages', 'destinations running')
    })
}


