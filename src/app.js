import $ from 'jquery'
import io from 'socket.io-client'
var socket = io.connect()


var sources
var destinations
var ioTable
var sourceArr = []
var routerState = document.getElementById('routerState')
var appMessages = document.getElementById('appMessages')
var routerContainer = document.getElementById('routerContainer')
var th = document.getElementById('thead1')
var routerBody = document.getElementById('routerBody')


document.addEventListener('DOMContentLoaded', function () {

	window.addEventListener('load', setTableSize, false)
	window.addEventListener('resize', setTableSize, false)
	appMessages.innerText = 'page fully loaded'
	appMessages.style.color = 'green'


	// sockets
	socket.on('connect', () => {
		$('#ioState').text('Web server online').css('color', 'green')
		$('td > select').text('')
		document.getElementById('headerText').style.color = 'green'
		socket.emit('get destinations')
	})
	
	
	socket.on('disconnect', () => {
		$('#ioState').text('Web server is down...').css('color', 'red')
	})
	
	
	socket.on('bmdRouter state', (msg) => {
		if (msg.state === true) {
			routerState.innerText = 'Router online'
			routerState.style.color = 'green'
		} else {
			routerState.innerText = 'Router offline'
			routerState.style.color = 'red'
			$('#routerContainer').fadeTo(1000, .25)
		}
	})


	socket.on('dest init', (msg) => {
		appMessages.innerText = 'dest init socket'
		destinations = msg
		socket.emit('get sources')
	})
	

	socket.on('source init', (msg) => {
		sources = msg.inputLabels
		ioTable = msg.ioTable
		appMessages.innerText = 'source init socket'
		socket.emit('get io')
	})


	socket.on('io init', (msg) => {
		appMessages.innerText = 'websockets online'
		ioTable = msg
		generate_table()
	})

	socket.on('io change', (msg) => {
		let el = document.getElementById(`dropDownDest${msg.dest}`)
		el.value = msg.src
	})
	

	socket.on('server messages', (msg) => {
		document.getElementById('appMessages').innerText = msg
	})

})


function setTableSize() {
	let tableBodyHeight = routerContainer.offsetHeight - th.offsetHeight - 2
	routerBody.style.height = `${tableBodyHeight}px`
}


function initSelectors() {
	const selectors = document.querySelectorAll('select')
	selectors.forEach((element) => {
		element.addEventListener('change', (event) => {
			socket.emit('change request', {
				dest: parseInt(event.target.dataset.input),
				source: parseInt(event.target.value)
			})
		})
	})
}


function generate_table() {
	console.log('generate table');
	var body = document.getElementById('routerTable')
	var tbl = document.getElementById('routerBody')
	for (var key in sources) {
		const row = document.createElement('tr')
		row.id = `routerIO${key}`
		const td2 = document.createElement('td')
		const td1 = document.createElement('td')
		const sel = document.createElement('select')
		const opt = document.createElement('option')
		sel.id = `dropDownDest${key}`
		td1.id = `mon${key}source`
		td2.id = `mon${key}dest`
		td2.innerText = destinations[key]
		sel.appendChild(opt)
		td1.appendChild(sel)
		row.appendChild(td1)
		row.appendChild(td2)
		tbl.appendChild(row)
	}
	body.appendChild(tbl)

	for (var ind in sources) {
		sourceArr[ind] = sources[ind]
	}
	addSourceList()
}


function addSourceList() {
	for (var key in sources) {
		if (sources.hasOwnProperty(key)) {
			for (var i = 0; i < sourceArr.length; i++) {
				$('#dropDownDest' + i).append($('<option></option>').text(sources[key]).val(key))
				let dd = document.getElementById('dropDownDest' + i)
				dd.dataset.input = i
			}
		}
		
	}
	initCurrentState()
}


function initCurrentState() {
	for (const key in ioTable) {
		if (ioTable.hasOwnProperty(key)) {
			const element = document.getElementById(`dropDownDest${key}`)
			element.value = ioTable[key]
		}
	}
	initSelectors()
}
