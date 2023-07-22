const express = require('express')
const app = express()

// Define middleware for all routes
app.use(express.json());

// Define route for GET request on path '/'
app.get('/', (request, response) => {
  response.send('Emitter Server Ready');
});

app.get('/emitlog', (request, response) => {
    response.send('Emitted trace');
  });

// Start the server on port 3000
app.listen(
   5000, 
   () => console.log(`Server listening on port 5000.`));