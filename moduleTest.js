const bmdRouter = require('./testStuff')
const StringDecoder = require('string_decoder').StringDecoder
const routerText = new StringDecoder('utf8')


bmdRouter.on('connect', () => {
    console.log('connected');
    bmdRouter.write(Buffer.from('VIDEO OUTPUT ROUTING:\n\n'))
})

bmdRouter.on('data', (data) => {
    console.log(routerText.write(data));
})

