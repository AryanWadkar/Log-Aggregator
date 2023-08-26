const express = require('express')
const app = express()

app.use(express.json());

app.get('/', (request, response) => {
  response.send('Emitter Server Ready');
});

app.get('/emitlog', (request, response) => {
    response.send('Emitted trace');
});

app.listen(5002, () => console.log(`Emitter listening on port 5002.`));