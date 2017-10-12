const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const jwt = require('jsonwebtoken');
const localKey = require('./key.js');

const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set('port', process.env.PORT || 3000);
app.set('secretKey', process.env.SECRET_KEY || localKey);
app.locals.title = 'BYOB';

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

// AUTHENTICATION MIDDLEWARE

const checkAuth = (request, response, next) => {
  const token = request.headers.authorization || request.query.token || request.body.token;

  if(!token) {
    response.status(403).json({ error: 'You must be authorized to hit this endpoint.' });
  } else {
    jwt.verify(token, app.get('secretKey'), (err, decoded) => {
      if (err) {
        response.status(403).json({ error: 'Invalid token.' });
      }
      if (decoded) {
        decoded.admin ? next()
        :
        response.status(403).json({ error: 'You are not authorized to have write access to this endpoint.' })
      }
    });
  };
}

const checkToken = (request, response, next) => {
  const token = request.headers.authorization || request.query.token || request.body.token;

  if (!token) {
    response.status(403).json({ error: 'You must be authorized to hit this endpoint.' });
  } else {
      jwt.verify(token, app.get('secretKey'), (err, decoded) => {
        if (err) {
          return response.status(403).json({ error: 'Invalid token.' });
        }
        next();
      });
  }
}

// ENDPOINTS

app.post('/api/v1/user/authenticate', (request, response) => {
  const { email, app_name } = request.body;
  let user;
  if (!email || !app_name) {
    response.status(422).json({ error: 'You are missing a required parameter. Please include both email address and the name of your application.'});
  }
  const emailSuffix = email.split('@')[1];
  emailSuffix === 'turing.io' ?
    user = Object.assign({}, request.body, { admin: true })
    :
    user = Object.assign({}, request.body, { admin: false })

  const token = jwt.sign(user, app.get('secretKey'), { expiresIn: '48h' });
  response.status(201).json({ token });
});

app.get('/api/v1/ports', checkToken, (request, response) => {
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

app.get('/api/v1/port-usage', checkToken, (request, response) => {
  database('port_usage').select()
    .then( ports => response.status(200).json(ports) )
    .catch( error => response.status(500).json({ error }))
});

app.get('/api/v1/ships', checkToken, (request, response) => {
  const { name, port } = request.query;
  let queryObject = {};

  if (Object.keys(request.query).length) {
    if (name) {
      const alteredName = name.split('_').join(' ');
      queryObject = Object.assign({}, { ship_name: alteredName.toUpperCase() });
    }
    if (port) {
      queryObject = Object.assign({}, queryObject, { ship_current_port: port });
    }
  }

  database('ships').where(queryObject).select()
  .then( ships => response.status(200).json(ships))
  .catch( error => response.status(500).json({ error }))
});

app.get('/api/v1/ports/:id', checkToken, (request, response) => {
  const { id } = request.params;

  database('ports').where({ id }).select()
    .then( port => {
      if (!port.length) {
        response.status(404).json({ error: 'There is no port with this id.' })
      }

      const portPromise = [];

      portPromise.push(
        database('port_usage').where({ port_id: id }).select()
          .then( usage => Object.assign({}, port[0], { port_usage: usage[0] }))
      )
        return Promise.all(portPromise)
    })
    .then( port => response.status(200).json(port))
    .catch( error => response.status(500).json({ error }));
});

app.get('/api/v1/ships/:id', checkToken, (request, response) => {
  const { id } = request.params;

  database('ships').where({ id }).select()
    .then( ship => {
      !ship.length ?
        response.status(404).json({ error: 'There is no ship with this id.' })
        :
        response.status(200).json(ship)
    })
    .catch( error => response.status(500).json({ error }))
});

app.post('/api/v1/ports', checkAuth, (request, response) => {
  const portObject = request.body;
  delete request.body.token;

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
    };

  for (let requiredParameter of [
    'cargo_vessels',
    'fishing_vessels',
    'various_vessels',
    'tanker_vessels',
    'tug_offshore_supply_vessels',
    'passenger_vessels',
    'authority_military_vessels',
    'sailing_vessels',
    'aid_to_nav_vessels'
  ]) {
    if (!portObject.port_usage[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: port_usage: { cargo_vessels: <String>, fishing_vessels: <String>, various_vessels: <String>, tanker_vessels: <String>, tug_offshore_supply_vessels: <String>, passenger_vessels: <String>, authority_military_vessels: <String>, sailing_vessels: <String>, aid_to_nav_vessels: <String> }. You're missing a ${requiredParameter} property.` });
    }
  };

  database('ports').insert({
    port_name: portObject.port_name,
    port_locode: portObject.port_locode,
    port_max_vessel_size: portObject.port_max_vessel_size,
    port_total_ships: portObject.port_total_ships,
    port_country: portObject.port_country,
  }, '*')
    .then( port => {
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

      database('port_usage').insert(
      Object.assign({}, portObject.port_usage, { port_id: port[0].id }), '*')
      .then( result => {
        response.status(201).json(Object.assign({}, port[0], { port_usage: result[0] }))
      })
      .catch( error => response.status(500).json({ error }));
    })
    .catch( error => response.status(500).json({ error }));
});

app.post('/api/v1/ships', checkAuth, (request, response) => {
  const shipObject = request.body;
  delete request.body.token;

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
    .then( ship => response.status(201).json(ship))
    .catch( error => response.status(500).json({ error }));
});

app.delete('/api/v1/ports/:id', checkAuth, (request, response) => {
  const { id } = request.params;
  delete request.body.token;

  database('port_usage').where({ port_id: id }).del()
    .then( deleted => !deleted ?
      response.status(404).json({ error: 'A port matching the id submitted could not be found' })
      :
      database('ports').where({ id }).del()
        .then( deleted => !deleted ?
        response.status(404).json({ error: 'A port matching the id submitted could not be found' })
        :
        response.sendStatus(204))
        .catch( error => response.status(500).json({ error })))
    .catch( error => response.status(500).json({ error }));
});

app.delete('/api/v1/ships/:id', checkAuth, (request, response) => {
  const { id } = request.params;
  delete request.body.token;

  database('ships').where({ id }).del()
    .then( deleted => !deleted ?
      response.status(404).json({ error: 'A ship matching the id submitted could not be found' })
      :
      response.sendStatus(204) )
    .catch( error => response.status(500).json({ error }) );
});

app.patch('/api/v1/ships/:id', checkAuth, (request, response) => {
  const { id } = request.params;
  const { ship_country, ship_type, ship_status, ship_current_port } = request.body;

  if (!ship_country && !ship_type && !ship_status && !ship_current_port) {
        return response.status(422).send({ error: "Expected format: { ship_country: <String>, ship_type: <String>, ship_status: <String>, <String>, ship_current_port: <Integer> }. You're missing a valid property." });
  }

  database('ships').where({ id })
  .update({
    ship_country,
    ship_type,
    ship_status,
    ship_current_port
  }, '*')
  .then( update => response.status(200).json(update))
  .catch( error => response.status(500).json({ error }));
});

app.patch('/api/v1/ports/:id', checkAuth, (request, response) => {
  const { id } = request.params;
  const { port_max_vessel_size, port_total_ships } = request.body;

  if (!port_max_vessel_size && !port_total_ships) {
        return response.status(422).send({ error: "Expected format: { port_max_vessel_size: <String>, port_total_ships: <Integer>." });
  }

  database('ports').where({ id })
  .update({
    port_max_vessel_size,
    port_total_ships
  }, '*')
  .then( update => response.status(200).json(update))
  .catch( error => response.status(500).json({ error }));
});

app.put('/api/v1/port-usage/:id', checkAuth, (request, response) => {
  const { id } = request.params;
  delete request.body.token;

  if (request.body.port_id) {
    return response
    .status(422)
    .send({ error: 'You are not authorized to change the port id' });
  }


  for (let requiredParameter of [
    'cargo_vessels',
    'fishing_vessels',
    'various_vessels',
    'tanker_vessels',
    'tug_offshore_supply_vessels',
    'passenger_vessels',
    'authority_military_vessels',
    'sailing_vessels',
    'aid_to_nav_vessels'
  ]) {
    if (!request.body[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { cargo_vessels: <String>, fishing_vessels: <String>, various_vessels: <String>, tanker_vessels: <String>, tug_offshore_supply_vessels: <String>, passenger_vessels: <String>, authority_military_vessels: <String>, sailing_vessels: <String>, aid_to_nav_vessels: <String> }. You're missing a ${requiredParameter} property.` });
    }
  };

  database('port_usage').where({ port_id: id })
  .update(request.body, '*')
  .then( update => response.status(200).json(update))
  .catch( error => response.status(500).json({ error }));
});


module.exports = app;
