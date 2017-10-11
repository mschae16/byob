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
    .then( ports => {
      const portPromises = [];

      ports.forEach( port => {
        portPromises.push(
          database('port_usage').where({ port_id: port.id }).select()
            .then( usage => Object.assign({}, port, { port_usage: usage[0] }))
        )
          })
      return Promise.all(portPromises)
    })
    .then( result => response.status(200).json(result))
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
  database('ships').where({ id }).select()
    .then( ship => response.status(200).json(ship))
    .catch( error => response.status(500).json({ error }))
});

app.post('/api/v1/ports', (request, response) => {
  const portObject = request.body;
  for (let requiredParameter of [
    'port_name',
    'port_locode',
    'port_max_vessel_size',
    'port_total_ships',
    'port_country',
    'port_usage'
  ]) {
      if (!portObject[requiredParameter]) {
        return response
          .status(422)
          .send({ error: `Expected format: { port_name: <String>, port_locode: <String>, port_max_vessel_size: <String>, port_total_ships: <String>, port_country: <String>, port_usage: <Object> }. You're missing a ${requiredParameter} property.` });
      }
    }

  database('ports').insert({
    port_name: portObject.port_name,
    port_locode: portObject.port_locode,
    port_max_vessel_size: portObject.port_max_vessel_size,
    port_total_ships: portObject.port_total_ships,
    port_country: portObject.port_country,
  }, 'id')
    .then( portId => {
      const {
        cargo_vessels,
        fishing_vessels,
        various,
        tankers,
        tug_offshore_supply,
        passenger_vessels,
        authority_military,
        sailing_vessels,
        aids_to_nav
      } = portObject.port_usage;
      database('port_usage').insert({
        cargo_vessels,
        fishing_vessels,
        various_vessels: various,
        tanker_vessels: tankers,
        tug_offshore_supply_vessels: tug_offshore_supply,
        passenger_vessels,
        authority_military_vessels: authority_military,
        sailing_vessels,
        aid_to_nav_vessels: aids_to_nav,
        port_id: portId
      })
    })
    .then( () => {
      response.status(201).json({ message: 'New port created.'})
    })
    .catch( error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/ships', (request, response) => {
  const shipObject = request.body;
  for (let requiredParameter of [
    'ship_name',
    'ship_country',
    'ship_type',
    'ship_length',
    'ship_imo',
    'ship_status',
    'ship_mmsi_callsign',
    'ship_current_port'
  ]) {
      if (!shipObject[requiredParameter]) {
        return response
          .status(422)
          .send({ error: `Expected format: { ship_name: <String>, ship_country: <String>, ship_type: <String>, ship_length: <String>, ship_imo: <String>, ship_status: <String>, ship_mmsi_callsign: <String>, ship_current_port: <Integer> }. You're missing a ${requiredParameter} property.` });
      }
    }

  database('ships').insert(shipObject, '*')
    .then( ship => {
      response.status(201).json(ship)
    })
    .catch( error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/ports/:id', (request, response) => {
  const { id } = request.params;

  database('ports').where({ id }).del()
    .then( deleted => !deleted ?
      response.status(404).json({ error: 'A port matching the id submitted could not be found' })
      :
      response.sendStatus(204) )
    .catch( error => response.status(500).json({ error }) );
});

app.delete('/api/v1/ships/:id', (request, response) => {
  const { id } = request.params;

  database('ships').where({ id }).del()
    .then( deleted => !deleted ?
      response.status(404).json({ error: 'A ship matching the id submitted could not be found' })
      :
      response.sendStatus(204) )
    .catch( error => response.status(500).json({ error }) );
});


module.exports = app;
