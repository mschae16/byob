const ports = require('../../../ports.json');
const ships = require('../../../ships.json');

const createPortUsage = (knex, usage, port_id) => {
  return knex('port_usage').insert({
    cargo_vessels: usage.cargo_vessels,
    fishing_vessels: usage.fishing_vessels,
    various_vessels: usage.various,
    tanker_vessels: usage.tankers,
    tug_offshore_supply_vessels: usage.tug_offshore_supply,
    passenger_vessels: usage.passenger_vessels,
    authority_military_vessels: usage.authority_military,
    sailing_vessels: usage.sailing_vessels,
    aid_to_nav_vessels: usage.aids_to_nav,
    port_id: port_id
  });
};

const createShip = (knex, ship, port_id) => {

  return knex('ships').insert({
    ship_name: ship.ship_name,
    ship_country: ship.ship_country,
    ship_type: ship.type,
    ship_length: ship.length,
    ship_imo: ship.imo_number,
    ship_status: ship.current_status,
    ship_mmsi_callsign: ship.mmsi_callsign,
    ship_current_port: port_id
  });
};

const createPort = (knex, port) => {
  return knex('ports').insert({
    port_name: port.port_name,
    port_locode: port.port_locode,
    port_max_vessel_size: port.max_vessel_size,
    port_total_ships: port.total_ships_at_port,
    port_country: port.country
  }, '*')
    .then( portObject => {
      const foundPort = ports.find(port => port.port_name === portObject[0].port_name);
      const portPromise = createPortUsage(knex, foundPort.port_usage, portObject[0].id);

      const shipPromises = [];
      const filteredShips = ships.filter( ship => ship.port === portObject[0].port_name);

      filteredShips.forEach( ship => {
        shipPromises.push(
          createShip(knex, ship, portObject[0].id)
        );
      });

      return Promise.all([portPromise, ...shipPromises]);
    })
    .catch(error => console.error('Error seeding data', error))
};

exports.seed = (knex, Promise) => {
  return knex('ships').del()
    .then( () => knex('port_usage').del() )
    .then( () => knex('ports').del() )
    .then( () => {
      let portPromises = [];

      ports.forEach( port => {
        portPromises.push(createPort(knex, port));
      });
      return Promise.all(portPromises);
    })
    .catch(error => console.error('Error seeding data', error))
};
