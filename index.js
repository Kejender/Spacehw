const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.static('dist'))


//https://osdr.nasa.gov/geode-py/ws/api/hardware

function fetchHw(hwlinks) {

    hwlinks.forEach(element => {
        console.log(element.hardware)
        //hwService.getHW(element.hardware)
    });

}

//let hwlinks

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


let hwdata

fetch("https://osdr.nasa.gov/geode-py/ws/api/hardware/133")
    .then((res)=> res.json())
    .then((data)=>{
        //console.log(data)
        hwdata = data
    })
    .catch((err)=>{
        console.log("error occured", err)
})


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/hw', (request, response) => {
    response.send('<h1>Hardware '+hwlist.length+'</h1>')
})

app.get('/api/hwinfo', (request, response) => {

    console.log(typeof(hwlist))

    response.send(hwlist)
    

    
    /*async function fetchHw() 
    
    
    {
        const response = await fetch("https://osdr.nasa.gov/geode-py/ws/api/hardware/133");
        const hardware = await response.json();
        console.log(hardware)
        response.send(response.json())
    }*/
    //fetchHw();
})

/*async function fetchHw(hw) {
  const response = await fetch(hw, {mode:'no-cors'});
  const hardware = await response.json();
  console.log(hardware)
}*/

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)