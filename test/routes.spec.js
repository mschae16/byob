const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const token = require('../token.js');

chai.use(chaiHttp);

describe('Client Routes', () => {

  it('should return the homepage', (done) => {
    chai.request(server)
    .get('/')
    .end( (error, response) => {
      response.should.have.status(200);
      response.should.be.html;
      response.res.text.should.include('BYOB');
      done();
    });
  });

  it('should return a 404 for route that does not exist', (done) => {
    chai.request(server)
    .get('/shenanigans')
    .end( (error, response) => {
      response.should.have.status(404);
      done();
    });
  });
});

describe('API Routes', () => {

  before( (done) => {
      database.migrate.latest()
        .then( () => done() )
        .catch( (error) => console.log(error) );
    });

    beforeEach( (done) => {
      database.seed.run()
        .then( () => done() )
        .catch( (error) => console.log(error) );
    });

    describe('POST /api/v1/user/authenticate', () => {
      it('should generate a token for new user', (done) => {
        chai.request(server)
          .post('/api/v1/user/authenticate')
          .send({
            email: 'marlin@turing.io',
            app_name: 'wallabies'
          })
          .end( (error, response) => {
            response.should.have.status(201);
            response.should.be.json;
            response.body.should.be.a('object');
            response.body.should.have.property('token');
            done();
          });
      });

      it('should not return a token if missing data', (done) => {
        chai.request(server)
          .post('/api/v1/user/authenticate')
          .send({
            name: 'max'
          })
          .end( (error, response) => {
            response.should.have.status(422);
            response.body.error.should.equal('You are missing a required parameter. Please include both email address and the name of your application.');
            done();
          });
      });
    });

    describe('GET /api/v1/ports', () => {
      it('should retrieve all ports', (done) => {
        chai.request(server)
          .get('/api/v1/ports')
          .set('Authorization', token)
          .end( (error, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('array');
            response.body.length.should.equal(3);
            response.body[0].should.have.property('id');
            response.body[0].should.have.property('port_name');
            response.body[0].should.have.property('port_locode');
            response.body[0].should.have.property('port_max_vessel_size');
            response.body[0].should.have.property('port_total_ships');
            response.body[0].should.have.property('port_country');
            response.body[0].should.have.property('port_usage');
            response.body[0].port_usage.should.have.property('cargo_vessels');
            response.body[0].port_usage.should.have.property('fishing_vessels');
            response.body[0].port_usage.should.have.property('various_vessels');
            response.body[0].port_usage.should.have.property('tanker_vessels');
            response.body[0].port_usage.should.have.property('tug_offshore_supply_vessels');
            response.body[0].port_usage.should.have.property('passenger_vessels');
            response.body[0].port_usage.should.have.property('authority_military_vessels');
            response.body[0].port_usage.should.have.property('sailing_vessels');
            response.body[0].port_usage.should.have.property('aid_to_nav_vessels');
            response.body[0].port_usage.should.have.property('port_id');
            done();
          });
      });

      it('should return a 404 if the url is incorrect', (done) => {
      chai.request(server)
        .get('/api/v1/portsss')
        .end( (error, response) => {
          response.should.have.status(404);
          done();
        });
      });
    });

    describe('GET /api/v1/port-usage', () => {
      it('should retrieve all port-usage', (done) => {
        chai.request(server)
          .get('/api/v1/port-usage')
          .set('Authorization', token)
          .end( (error, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('array');
            response.body.length.should.equal(3);
            response.body[0].should.have.property('cargo_vessels');
            response.body[0].should.have.property('fishing_vessels');
            response.body[0].should.have.property('various_vessels');
            response.body[0].should.have.property('tanker_vessels');
            response.body[0].should.have.property('tug_offshore_supply_vessels');
            response.body[0].should.have.property('passenger_vessels');
            response.body[0].should.have.property('authority_military_vessels');
            response.body[0].should.have.property('sailing_vessels');
            response.body[0].should.have.property('aid_to_nav_vessels');
            response.body[0].should.have.property('port_id');
            done();
          });
      });

      it('should return a 404 if the url is incorrect', (done) => {
        chai.request(server)
          .get('/api/v1/port-usageee')
          .end( (error, response) => {
            response.should.have.status(404);
            done();
          });
      });
    });

    describe('GET /api/v1/ships', () => {
      it('should retrieve all ships', (done) => {
        chai.request(server)
          .get('/api/v1/ships')
          .set('Authorization', token)
          .end( (error, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('array');
            response.body.length.should.equal(10);
            response.body[0].should.have.property('id');
            response.body[0].should.have.property('ship_name');
            response.body[0].should.have.property('ship_country');
            response.body[0].should.have.property('ship_type');
            response.body[0].should.have.property('ship_length');
            response.body[0].should.have.property('ship_imo');
            response.body[0].should.have.property('ship_status');
            response.body[0].should.have.property('ship_mmsi_callsign');
            response.body[0].should.have.property('ship_current_port');
            done();
          });
      });

      it('should return a 404 if the url is incorrect', (done) => {
        chai.request(server)
          .get('/api/v1/shipsss')
          .end( (error, response) => {
            response.should.have.status(404);
            done();
          });
      });
    });

    describe('GET /api/v1/ports/:id', () => {
      it('should retrieve a single port based on the id submitted in url', (done) => {
        chai.request(server)
          .get('/api/v1/ports/20')
          .set('Authorization', token)
          .end( (error, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('array');
            response.body.length.should.equal(1);
            done();
          });
      });

      it('should return an error if no port exists with id submitted', (done) => {
        chai.request(server)
          .get('/api/v1/ports/5')
          .set('Authorization', token)
          .end( (error, response) => {
            response.should.have.status(404);
            response.body.error.should.equal('There is no port with this id.');
            done();
          });
      });
    });

    describe('GET /api/v1/ships/:id', () => {
      it('should retrieve a single ship based on the id submitted in the url', (done) => {
        chai.request(server)
          .get('/api/v1/ships/5')
          .set('Authorization', token)
          .end( (error, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('array');
            response.body.length.should.equal(1);
            done();
          });
      });

      it('should return an error if no ship exists with id submitted', (done) => {
        chai.request(server)
          .get('/api/v1/ships/99')
          .set('Authorization', token)
          .end( (error, response) => {
            response.should.have.status(404);
            response.body.error.should.equal('There is no ship with this id.');
            done();
          });
      });
    });

    describe('POST /api/v1/ports', () => {
      it('should add a new port to the ports table', (done) => {
        const mockObject = {
            token,
            id: '40',
            port_name: 'Osaka',
            port_locode: 'JPOSA',
            port_usage: {
              cargo_vessels: '63.93%',
              fishing_vessels: '0.2%',
              various_vessels: '5.81%',
              tanker_vessels: '17.64%',
              tug_offshore_supply_vessels: '9.62%',
              passenger_vessels: '0.8%',
              authority_military_vessels: '0.8%',
              sailing_vessels: '1.2%',
              aid_to_nav_vessels: '0%'
            },
            port_max_vessel_size: 'unavailable',
            port_total_ships: 745,
            port_country: 'Japan'
        }

        chai.request(server)
          .post('/api/v1/ports')
          .send(mockObject)
          .end( (error, response) => {
              response.should.have.status(201);
              response.should.be.json;
              response.should.be.a('object');
              response.body.should.not.have.property('token');
              response.body.should.have.property('id');
              response.body.should.have.property('port_name');
              response.body.should.have.property('port_locode');
              response.body.should.have.property('port_max_vessel_size');
              response.body.should.have.property('port_total_ships');
              response.body.should.have.property('port_country');
              response.body.should.have.property('port_usage');
              response.body.port_usage.should.have.property('cargo_vessels');
              response.body.port_usage.should.have.property('fishing_vessels');
              response.body.port_usage.should.have.property('various_vessels');
              response.body.port_usage.should.have.property('tanker_vessels');
              response.body.port_usage.should.have.property('tug_offshore_supply_vessels');
              response.body.port_usage.should.have.property('passenger_vessels');
              response.body.port_usage.should.have.property('authority_military_vessels');
              response.body.port_usage.should.have.property('sailing_vessels');
              response.body.port_usage.should.have.property('aid_to_nav_vessels');
              response.body.port_usage.should.have.property('port_id');

              chai.request(server)
              .get('/api/v1/ports')
              .set('Authorization', token)
              .end( (error, response) => {
                response.should.have.status(200);
                response.body.should.be.a('array');
                response.body.length.should.equal(4);
                done();
              });
          });
      });

      it('should not add a new port if incorrect information is submitted', (done) => {
        const mockObject = {
            token,
            port_name: 'Osaka',
            port_locode: 'JPOSA',
            max_vessel_size: 'unavailable',
            port_total_ships: 745,
            port_country: 'Japan'
        }

        chai.request(server)
          .post('/api/v1/ports')
          .send(mockObject)
          .end( (error, response) => {
            response.should.have.status(422);
            response.should.be.json;
            response.body.error.should.equal('Expected format: { port_name: <String>, port_locode: <String>, port_max_vessel_size: <String>, port_total_ships: <Integer>, port_country: <String>, port_usage: <Object> }. You\'re missing a port_max_vessel_size property.');

            chai.request(server)
              .get('/api/v1/ports')
              .set('Authorization', token)
              .end( (error, response) => {
                response.should.have.status(200);
                response.body.should.be.a('array');
                response.body.length.should.equal(3);
                done();
              });
          });
      });

      it('should not add a new port if missing information', (done) => {
        const mockObject = {
            token,
            port_name: 'Osaka',
            port_locode: 'JPOSA',
            port_usage: {
              cargo_vessels: '63.93%',
              fishing_vessels: '0.2%',
              various_vessels: '5.81%',
              sailing_vessels: '1.2%',
              aid_to_nav_vessels: '0%'
            },
            port_max_vessel_size: 'unavailable',
            port_total_ships: 745,
            port_country: 'Japan'
        }

        chai.request(server)
          .post('/api/v1/ports')
          .send(mockObject)
          .end( (error, response) => {
            response.should.have.status(422);
            response.should.be.json;
            response.body.error.should.equal('Expected format: port_usage: { cargo_vessels: <String>, fishing_vessels: <String>, various_vessels: <String>, tanker_vessels: <String>, tug_offshore_supply_vessels: <String>, passenger_vessels: <String>, authority_military_vessels: <String>, sailing_vessels: <String>, aid_to_nav_vessels: <String> }. You\'re missing a tanker_vessels property.');

            chai.request(server)
              .get('/api/v1/ports')
              .set('Authorization', token)
              .end( (error, response) => {
                response.should.have.status(200);
                response.body.should.be.a('array');
                response.body.length.should.equal(3);
                done();
              });
          });
      });
    });

    describe('POST /api/v1/ships', () => {
      it('should post a new ship to the database', (done) => {
        const mockObject = {
            token,
            id: '11',
            ship_status: 'moored',
            ship_imo: '8978116',
            ship_length: '105x16m',
            ship_mmsi_callsign: '273626900\nUDLE',
            ship_current_port: 10,
            ship_country: 'Russia',
            ship_name: 'JARGO',
            ship_type: 'Trawler'
        }
        chai.request(server)
          .post('/api/v1/ships')
          .send(mockObject)
          .end( (error, response) => {

            response.should.have.status(201);
            response.should.be.json;
            response.body.should.be.a('array');
            response.body.length.should.equal(1)
            response.body[0].should.have.property('id');
            response.body[0].should.have.property('ship_status');
            response.body[0].should.have.property('ship_imo');
            response.body[0].should.have.property('ship_length');
            response.body[0].should.have.property('ship_mmsi_callsign');
            response.body[0].should.have.property('ship_current_port');
            response.body[0].should.have.property('ship_country');
            response.body[0].should.have.property('ship_name');
            response.body[0].should.have.property('ship_type');

            chai.request(server)
            .get('/api/v1/ships')
            .set('Authorization', token)
            .end( (error, response) => {
              response.should.have.status(200);
              response.body.should.be.a('array');
              response.body.length.should.equal(11);
              done();
            });
          });
      });

      it('should not add a new ship if missing information', (done) => {
        const mockObject = {
          token,
          id: '11',
          ship_imo: '8978116',
          ship_length: '105x16m',
          ship_mmsi_callsign: '273626900\nUDLE',
          ship_current_port: 10,
          ship_country: 'Russia',
          ship_name: 'JARGO',
          ship_type: 'Trawler'
      }

        chai.request(server)
          .post('/api/v1/ships')
          .send(mockObject)
          .end( (error, response) => {
            response.should.have.status(422);
            response.should.be.json;
            response.body.error.should.equal('Expected format: { ship_name: <String>, ship_country: <String>, ship_type: <String>, ship_length: <String>, ship_imo: <String>, ship_status: <String>, ship_mmsi_callsign: <String>, ship_current_port: <Integer> }. You\'re missing a ship_status property.');

            chai.request(server)
              .get('/api/v1/ships')
              .set('Authorization', token)
              .end( (error, response) => {
                response.should.have.status(200);
                response.body.should.be.a('array');
                response.body.length.should.equal(10);
                done();
              });
          });
      });
    });

    describe('DELETE /api/v1/ships/:id', () => {
      it('should delete a ship from database', (done) => {
        chai.request(server)
          .delete('/api/v1/ships/7')
          .set('Authorization', token)
          .end( (error, response) => {
            response.should.have.status(204);

            chai.request(server)
              .get('/api/v1/ships')
              .set('Authorization', token)
              .end( (error, response) => {
                response.should.have.status(200);
                response.body.should.be.a('array');
                response.body.length.should.equal(9);
                done();
              });
          });
      });

      it('should not delete a ship from database if incorrect id passed in', (done) => {
        chai.request(server)
          .delete('/api/v1/ships/666')
          .set('Authorization', token)
          .end( (error, response) => {
            response.should.have.status(404);
            response.body.error.should.equal('A ship matching the id submitted could not be found.');
            done();
          });
      });

    });

    describe('DELETE /api/v1/ports/:id', () => {
      it('should delete a port from database', (done) => {
        chai.request(server)
          .delete('/api/v1/ports/20')
          .set('Authorization', token)
          .end( (error, response) => {
            response.should.have.status(204);

            chai.request(server)
              .get('/api/v1/ports')
              .set('Authorization', token)
              .end( (error, response) => {
                response.should.have.status(200);
                response.body.should.be.a('array');
                response.body.length.should.equal(2);
                done();
              });
          });
      });

      it('should not delete a port from database if incorrect id is submitted', (done) => {
        chai.request(server)
          .delete('/api/v1/ports/99')
          .set('Authorization', token)
          .end( (error, response) => {
            response.should.have.status(404);
            response.body.error.should.equal('A port matching the id submitted could not be found.');
            done();
          });
      });

    });



});
