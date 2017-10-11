const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'BYOB';

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

// ENDPOINTS

app.get('/api/v1/ports', (request, response) => {
  database('ports').select()
    .then( ports => response.status(200).json(ports) )
    .catch( error => response.status(500).json({ error }))
});

app.get('/api/v1/port-usage', (request, response) => {
  database('port_usage').select()
    .then( ports => response.status(200).json(ports) )
    .catch( error => response.status(500).json({ error }))
});

app.get('/api/v1/ships', (request, response) => {
  database('ships').select()
    .then( ships => response.status(200).json(ships))
    .catch( error => response.status(500).json({ error }))
});

app.get('/api/v1/ports/:id', (request, response) => {
  const { id } = request.params
  database('ports').where({ id }).select()
    .then( port => {
      let portUsage = database('port_usage').where({ id }).select()
      const result = Object.assign({}, port[0], { port_usage: portUsage[0] })
      return result
    })
    .then( result => response.status(200).json(result) )
    .catch( error => response.status(500).json({ error }))
});

app.get('/api/v1/ships/:id', (request, response) => {
  const { id } = request.params
  database('ships').select()
    .then( ship => response.status(200).json(ship))
    .catch( error => response.status(500).json({ error }))
});
