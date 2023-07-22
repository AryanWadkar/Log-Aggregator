const express = require('express')
const app = express()
const client=require('./db');




app.use(express.json({limit: '50mb'}));
// Define route for GET request on path '/'
app.get('/', async (request, response) => {
  response.send('response for GET request');
});

app.post('/recievelog', async (request, response) => {
  console.log("Recieved log");
  const span=request.body['resourceSpans'];
  const resouce=span[0];
  // const size=resouce.scopeSpans.attributes.length;
  // for(let i=0; i<size;i++) console.log(resouce.resource.scopeSpans[i]);
  let jsonData=resouce.resource;
  const extractedData = {};

jsonData.attributes.forEach(item => {
  extractedData[item.key] = item.value;
});

const finaldoc={...extractedData,"customerid":request.headers.customerid,"droppedAttributesCount":jsonData.droppedAttributesCount}
console.log(finaldoc);
    await client.index({ 
    index: 'traces',
    id: resouce.resource.attributes[4].value.intValue,
    document: finaldoc
}), (err, resp, status) => {
    console.log(resp);
}
  response.status(200).json({"message":"Ok"});
});

// Start the server on port 3000
app.listen(
   3000, 
   () => console.log(`Server listening on port 3000.`));