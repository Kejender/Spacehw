const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const app = express()
const logger = require('./utils/logger')
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
                    logger.info("Links handled: "+links.length);
                    resolve("Errors: "+errors);
                }
            })
           .catch((err)=>{
                errors++;
                logger.error("Error occured when handling hw data", err);
                logger.info("Link with a problem: ", element.hardware);
                resolve("Errors: "+errors);
        })
        });
    });
  }

// This function runs the two previous functions

  async function getHwData() {
    hwlist = []
    //hwlinks = []
    logger.info('Getting the link list...');
    const result_links = await getLinks();
    logger.info("Links: "+result_links.length);
    logger.info('Getting hardware data...');
    const result_data = await getData(result_links);
    logger.info("Result: "+result_data);
  }

  getHwData();

// sends the number of hw items
app.get('/api/hw', (request, response) => {
    response.send('<h1>Hardware items '+hwlist.length+'</h1>')
})

// sends the whole list of hardware items to front end
app.get('/api/hwinfo', (request, response) => {
    logger.info("Hardware list type: "+typeof(hwlist))
    logger.info(hwlist.length)
    response.send(hwlist)
})

// refetching all hardware data
app.get('/api/reset', (request, response) => {
    getHwData();
    response.send('<p>Resetting data...</p>')
})

module.exports = app