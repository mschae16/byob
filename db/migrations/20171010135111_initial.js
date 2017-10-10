
exports.up = (knex, Promise) => {
  return Promise.all([
      knex.schema.createTable('ports', (table) => {
        table.increments('id').primary()
        table.string('port_name').unique()
        table.string('port_locode').unique()
        table.string('port_max_vessel_size')
        table.integer('port_total_ships')
        table.string('port_country')
        table.timestamps(true, true)
      }),
      knex.schema.createTable('port_usage', (table) => {
        table.string('cargo_vessels')
        table.string('fishing_vessels')
        table.string('various_vessels')
        table.string('tanker_vessels')
        table.string('tug_offshore_supply_vessels')
        table.string('passenger_vessels')
        table.string('authority_military_vessels')
        table.string('sailing_vessels')
        table.string('aid_to_nav_vessels')
        table.integer('port_id').unsigned()
        table.foreign('port_id').references('ports.id')
        table.timestamps(true, true)
      }),
      knex.schema.createTable('ships', (table) => {
        table.increments('id').primary()
        table.string('ship_name')
        table.string('ship_country')
        table.string('ship_type')
        table.integer('ship_length')
        table.string('ship_imo')
        table.string('ship_status')
        table.string('ship_mmsi_callsign')
        table.integer('ship_current_port').unsigned()
        table.foreign('ship_current_port').references('ports.id')
        table.timestamps(true, true)
      })
  ])
};

exports.down = (knex, Promise) => {
  return Promise.all([
      knex.schema.dropTable('ships'),
      knex.schema.dropTable('port_usage'),
      knex.schema.dropTable('ports')
  ])
};
