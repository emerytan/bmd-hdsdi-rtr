import sources from '../bin/objectifySources'
import destinations from '../bin/objectifyDestinations'
import $ from 'jquery'
import io from 'socket.io-client'
var socket = io.connect()



document.addEventListener('DOMContentLoaded', function () {

	var sourceArr = []
	for (var ind in sources) {
		sourceArr[ind] = sources[ind]
	}

	var routerState = document.getElementById('routerState')
	var appMessages = document.getElementById('appMessages')

	appMessages.innerText = 'page fully loaded'
	appMessages.style.color = 'green'
	generate_table()

	// sockets
	socket.on('connect', () => {
		$('#ioState').text('Web server online').css('color', 'green')
		$('td > select').text('')
		document.getElementById('headerText').style.color = 'green'
		socket.emit('get destinations')
		socket.emit('get sources')
	})


	socket.on('disconnect', () => {
		$('#ioState').text('Web server is down... call Barbary').css('color', 'red')
	})


	socket.on('bmdRouter state', (msg) => {
		if (msg === true) {
			routerState.innerText = 'Router online'
			routerState.style.color = 'green'
		} else {
			routerState.innerText = 'Router offline'
			routerState.style.color = 'red'
			$('#routerContainer').fadeTo(1000, .25)
		}
	})

	socket.on('source init', (msg) => {
		console.log(msg)
		for (var key in sources) {
			if (sources.hasOwnProperty(key)) {
				for (var i = 0; i < sourceArr.length; i++) {
					$('#dropDownDest' + i).append($('<option></option>').text(sources[key]).val(key))
					var dd = document.getElementById('dropDownDest' + i)
					dd.dataset.input = i
				}
			}
		}
		initSelectors()
	})

	socket.on('server messages', (msg) => {
		document.getElementById('appMessages').innerText = msg
	})

})



function initSelectors() {
	const selectors = document.querySelectorAll('select')
	selectors.forEach((element) => {
		element.addEventListener('change', (event) => {
			// Send the text content of the clicked element for processing
			socket.emit('change request', {
				dest: parseInt(event.target.dataset.input),
				source: parseInt(event.target.selectedIndex)
			})
		})
	})
}

function generate_table() {
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
		opt.innerText = '....'
		td2.innerText = destinations[key]
		sel.appendChild(opt)
		td1.appendChild(sel)
		row.appendChild(td1)
		row.appendChild(td2)
		tbl.appendChild(row)
	}
	body.appendChild(tbl)
}


// tbl.id = 'routerTable'
// tbl.classList.add('table')
// var headerRow = document.createElement('tr')
// var tableHeader1 = document.createElement('th')
// var tableHeader2 = document.createElement('th')
// tableHeader1.id = 'thead1'
// tableHeader2.id = 'thead2'
// tableHeader1.innerText = 'Sources'
// tableHeader2.innerText = 'Destinations'
// headerRow.appendChild(tableHeader1)
// headerRow.appendChild(tableHeader2)
// tbl.appendChild(headerRow)