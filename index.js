const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())

// uncomment for deployment
app.use(express.static('dist'))

// test function, not needed
function fetchHw(hwlinks) {
    hwlinks.forEach(element => {
        console.log(element.hardware)
    });
}

// Getting the hardware list, which is a list of links to descriptions of
// each hardware item. Each link is then fetched and the data is pushed to
// hwlist array. The array is served to front end.

let hwlist = []

fetch("https://osdr.nasa.gov/geode-py/ws/api/hardware")
    .then((res)=> res.json())
    .then((data)=>{
        console.log(data)
        hwlinks = data.data

        hwlinks.forEach(element => {
            console.log(element.hardware)
            fetch(element.hardware)
                .then((res)=> res.json())
                .then((data)=>{
                    //console.log(data)
                    hwlist.push(data)
                })
        });
        //console.log(hwlist.length)
    })
    .then(console.log("HWLIST"+hwlist))
    .catch((err)=>{
        console.log("error occured", err)
})

// sends the number of hw items
app.get('/api/hw', (request, response) => {
    response.send('<h1>Hardware items '+hwlist.length+'</h1>')
})

// sends the whole list of hardware items to front end
app.get('/api/hwinfo', (request, response) => {
    console.log(typeof(hwlist))
    response.send(hwlist)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)