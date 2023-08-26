const express = require('express')
const app = express()
const client=require('./db');
const MQ = require('bullmq');

const redisConn={
  host: process.env.REDIS_URL,
  port: 13955,
  password:process.env.REDIS_PASS,
  username:"default"
}

const myQueue = new MQ.Queue('trace',{ connection: redisConn});

function createUniqueSpanList(spans) {
  const uniqueSpans = [];
  const seenSpanSignatures = new Set();
  
  for (const span of spans) {
      const spanSignature = JSON.stringify({
          name: span.name,
          kind: span.kind,
          attributes: span.attributes,
          droppedAttributesCount: span.droppedAttributesCount,
          events: span.events,
          droppedEventsCount: span.droppedEventsCount,
          status: span.status,
          links: span.links,
          droppedLinksCount: span.droppedLinksCount
      });

      if (!seenSpanSignatures.has(spanSignature)) {
          seenSpanSignatures.add(spanSignature);
          uniqueSpans.push(span);
      }
  }

  return uniqueSpans;
}

const myWorker = new MQ.Worker('trace', async (job)=>{
  const span=job.data.body['resourceSpans'][0];
  const resouce=span.resource;
  const scopespans=span.scopeSpans[0];
  let extractedData = {};
  resouce.attributes.forEach(item => {
    let strkey=item.key;
    if(item.value.stringValue===undefined)
    {
      extractedData[strkey] = item.value.intValue;
    }else{
      extractedData[strkey] = item.value.stringValue;
    }
  
});
const uniquespans = createUniqueSpanList(scopespans.spans)
extractedData["spans"]=uniquespans
const finaldoc={...extractedData,'customerId':job.data.headers.customerid,'droppedAttributesCount':resouce.droppedAttributesCount}
  await client.index({ 
    index: 'traces',
    document: finaldoc}), (err, resp, status) => {
  }

}, { connection: redisConn});

const port=process.env.PORT||3001;

app.use(express.json({limit: '50mb'}));

app.get('/', async (request, response) => {
  response.send(`Aggregator Running on ${port}`);
});

app.post('/recievelog', async (request, response) => {
  console.log("Recieved log");
  await myQueue.add('addTrace', {body:request.body,headers:request.headers});
  response.send({"Message":"OK"});
});


app.listen(port, () => console.log(`Aggergator listening on port ${port}.`));