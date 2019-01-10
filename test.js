var selectors = document.querySelectorAll('select')
selectors.forEach((element) => {
    element.addEventListener('change', (event) => {
        var src = parseInt(event.target.value)
        alert(`source: ${src}`)
    })
})