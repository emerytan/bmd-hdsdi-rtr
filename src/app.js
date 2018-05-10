import sources from '../bin/objectifySources'
import destinations from '../bin/objectifyDestinations'
import $ from 'jquery'
import io from 'socket.io-client'
var socket = io.connect()


var sourceArr = []
for (var ind in sources) {
    sourceArr[ind] = sources[ind]
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('appMessages').innerText = 'page fully loaded'
    generate_table()

    socket.on('connect', (msg) => {
        $('#ioState').text('Web server is running...').css('color', 'green')
        $('td > select').text('')
        document.getElementById('headerText').style.color = 'green'
        socket.emit('get destinations')
        socket.emit('get sources')
    })


    socket.on('disconnect', () => {
        console.log('socket io disconnect');
        $('#ioState').text('Web server is down... call Barbary').css('color', 'red')
    })


    socket.on('bmdRouter state', (msg) => {
        if (msg === true) {
            document.getElementById('routerState').innerText = 'Router Online'
        } else {
            document.getElementById('routerState').innerText = 'Router Offline'
        }
    })

    socket.on('source init', (msg) => {
        for (var key in sources) {
            if (sources.hasOwnProperty(key)) {
                for (var i = 0; i < sourceArr.length; i++) {
                    $("#dropDownDest" + i).append($('<option></option>').text(sources[key]).val(key));
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

    function initSelectors() {
        const selectors = document.querySelectorAll('select')
        selectors.forEach((element, index) => {
            element.addEventListener('change', (event) => {
                // Send the text content of the clicked element for processing
                socket.emit('change request', {
                    dest: parseInt(event.target.dataset.input),
                    source: parseInt(event.target.selectedIndex)
                })
            })
        })
    }

    function generate_table() {  // get the reference for the body
        var body = document.getElementById("routerContainter");   // creates a <table> element and a <tbody> element
        var tbl  = document.createElement("table");
        tbl.id = "routerTable"
        tbl.classList.add('table')
        var headerRow = document.createElement("tr");
        var tableHeader1 = document.createElement("th")
        var tableHeader2 = document.createElement("th")
        tableHeader1.id = "thead1"
        tableHeader2.id = "thead2"
        tableHeader1.innerText = "Sources"
        tableHeader2.innerText = "Destinations"
        headerRow.appendChild(tableHeader1)
        headerRow.appendChild(tableHeader2)
        tbl.appendChild(headerRow);
        for (var key in sources) {
            const row = document.createElement("tr")
            row.id = `routerIO${key}`
            const td2 = document.createElement("td")
            const td1 = document.createElement("td")
            const sel = document.createElement("select")
            const opt = document.createElement("option")
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
        body.appendChild(tbl);
    }

});