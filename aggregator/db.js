const { Client } = require('@elastic/elasticsearch');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

var client = new Client({  
  cloud: {
    id: process.env.CLOUD_ID
  },
  auth: {
    username: process.env.UN,
    password: process.env.PASS
  }
});  

client.ping()
  .then(response => console.log("You are connected to Elasticsearch!"))
  .catch(error => console.error("Elasticsearch is not connected."))

module.exports = client; 