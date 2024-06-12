const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())

// uncomment for deployment
app.use(express.static('dist'))

// hardware data list that is served
let hwlist = [];

// Getting the hardware list, which is a list of links to descriptions of
// each hardware item.

function getLinks() {
    return new Promise((resolve) => {
        fetch("https://osdr.nasa.gov/geode-py/ws/api/hardware")
        .then((res)=> res.json())
        .then((data)=>{
            //hwlinks = data.data;
            resolve(data.data);
        })
        .catch((err)=>{
            console.log("Error while fetching the hardware list: ", err)
            fetcherror = err;
            return fetcherror;
        })
    });
  }

// This function gets the list of hardware item links.
// It fetches the data and adds them in the table

  function getData(links) {
    return new Promise((resolve) => {
        let link_counter = links.length;
        let errors = 0;
        links.forEach(element => {
            fetch(element.hardware)
            .then((res)=> res.json())
            .then((data)=>{
                //console.log(data)
                hwlist.push(data)
            })
            .then(()=>{
                link_counter--;
                if (link_counter == 0) {
                    console.log("Links handled: "+links.length);
                    resolve("Errors: "+errors);
                }
            })
           .catch((err)=>{
                errors++;
                console.log("Error occured when handling hw data", err);
                console.log("Link with a problem: ", element.hardware);
                resolve("Errors: "+errors);
        })
        });
    });
  }

// This function runs the two previous functions

  async function getHwData() {
    hwlist = []
    //hwlinks = []
    console.log('Getting the link list...');
    const result_links = await getLinks();
    console.log("Links: "+result_links.length);
    console.log('Getting hardware data...');
    const result_data = await getData(result_links);
    console.log("Result: "+result_data);
  }

  getHwData();

// sends the number of hw items
app.get('/api/hw', (request, response) => {
    response.send('<h1>Hardware items '+hwlist.length+'</h1>')
})

// sends the whole list of hardware items to front end
app.get('/api/hwinfo', (request, response) => {
    console.log("Hardware list type: "+typeof(hwlist))
    console.log(hwlist.length)
    response.send(hwlist)
})

// refetching all hardware data
app.get('/api/reset', (request, response) => {
    getHwData();
    response.send('<p>Response</p>')
    //response.send('<p>Hardware data fetched again. Status:'+fetchdataresponse+'</p>')
    //response.send('<p>Response:'+response.ok+'</p>')
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)