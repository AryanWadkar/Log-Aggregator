const express = require('express')
const app = express()
const client=require('./db');
const cors = require('cors');
const path = require('path');


app.use(express.json());
app.use(cors())
app.use(express.static(path.join(__dirname, 'vestigev', 'build')))


const port=process.env.PORT||8001;

app.get('/check', async (request, response) => {response.send(`Visualizer Ok serving on ${port}`)});

app.get('/getall', async (request, response) => {
    try{
        const res = await client.search({
            index: 'traces',
            size:"1000",
            query: {
                "match_all" : {}
            }
          });
        const data=[];
        res.hits.hits.forEach(e=>{data.push(e._source);})
        response.json({data:data,count:data.length});
    }catch(err)
    {
        response.status(504).json({data:err});
    }    
});

app.get('/mappings', async (request, response) => {
    try{
        const res = await client.indices.getMapping({ index:'traces'});
        function extractPropertiesKeys(obj, parentKey = "") {
          const keys = [];
      
          for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                  const currentKey = parentKey ? `${parentKey}.${key}` : key;
                  
                  if (key === "properties" && typeof obj[key] === "object") {
                      const propertiesObj = obj[key];
                      for (const subKey in propertiesObj) {
                          if (propertiesObj.hasOwnProperty(subKey)) {
                              const subKeyPath = `${currentKey}.${subKey}`;
                              keys.push(subKeyPath);
                          }
                      }
                  }
                  
                  if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
                      keys.push(...extractPropertiesKeys(obj[key], currentKey));
                  }
              }
          }
      
          return keys;
      }
      
      let extractedKeys = extractPropertiesKeys(res.traces.mappings);
      function replaceOccurrences(array, searchWord, replacement) {
        const replacedArray = array.map(item => item.replace(new RegExp(searchWord, 'g'), replacement));
        return replacedArray;
    }
    extractedKeys=replaceOccurrences(extractedKeys,"properties.","");
    response.json({data:extractedKeys});
    }catch(err)
    {
        response.status(504).json({data:[err]});
    }    
});

app.post('/search', async (request, response) => {
    function transformJSON(jsonObj) {
      const transformedArray = [];
  
      for (const key in jsonObj) {
          if (jsonObj.hasOwnProperty(key)) {
              const matchObj = {};
              matchObj["match"] = { [key]: jsonObj[key] };
              transformedArray.push(matchObj);
          }
      }
  
      return transformedArray;
  }
  
  const transformedArray = transformJSON(request.body.query);
    try{
        const res = await client.search(
          {
            "size":request.body.size,
            "query": { "bool": { "must": transformedArray,} }
          }
        )
      const data=[];
      res.hits.hits.forEach(e=>{data.push(e._source);})
      response.json({data:data,count:data.length});
    }catch(err)
    {
        response.status(504).json({data:[err]});
    }    
});


app.get('*', (req, res) => {res.sendFile(path.resolve(__dirname, 'vestigev', 'build', 'index.html'));});

app.listen(port, () => console.log(`Visualizer listening on port ${port}`));