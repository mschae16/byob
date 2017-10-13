const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const jwt = require('jsonwebtoken');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const localKey = process.env.SECRET_KEY || require('../key.js');

const token = jwt.sign({ email: 'test@turing.io', appName: 'Jargo', admin: true }, localKey);

chai.use(chaiHttp);

describe('Port Routes', () => {

  before((done) => {
    database.migrate.latest()
      .then(() => done())
      .catch((error) => console.log(error));
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch((error) => console.log(error));
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
          resposne.body.forEach( elem => {
            elem.should.have.property('id');
            elem.should.have.property('port_name');
            elem.should.have.property('port_locode');
            elem.should.have.property('port_max_vessel_size');
            elem.should.have.property('port_total_ships');
            elem.should.have.property('port_country');
            elem.should.have.property('port_usage');
            elem.port_usage.should.have.property('cargo_vessels');
            elem.port_usage.should.have.property('fishing_vessels');
            elem.port_usage.should.have.property('various_vessels');
            elem.port_usage.should.have.property('tanker_vessels');
            elem.port_usage.should.have.property('tug_offshore_supply_vessels');
            elem.port_usage.should.have.property('passenger_vessels');
            elem.port_usage.should.have.property('authority_military_vessels');
            elem.port_usage.should.have.property('sailing_vessels');
            elem.port_usage.should.have.property('aid_to_nav_vessels');
            elem.port_usage.should.have.property('port_id');
          });
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


  describe('POST /api/v1/ports', () => {
    it('should add a new port to the ports table', (done) => {
      const mockObject = {
        id: 40,
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
      };

      chai.request(server)
        .post('/api/v1/ports')
        .set('Authorization', token)
        .send(mockObject)
        .end( (error, response) => {
          response.should.have.status(201);
          response.should.be.json;
          response.should.be.a('object');
          response.body.should.include(mockObject);
          response.body.should.have.property('id');

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
      };

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
      };

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

  describe('PATCH /api/v1/ports/:id', () => {
    it('Should update the ports database with a patch request', (done) => {
      chai.request(server)
        .get('/api/v1/ports/10')
        .set('Authorization', token)
        .end( (error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body[0].should.have.property('port_total_ships');
          response.body[0].port_total_ships.should.equal(118);

          chai.request(server)
            .patch('/api/v1/ports/10')
            .set('Authorization', token)
            .send({ port_total_ships: 232 })
            .end( (error, response) => {
              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a('array');
              response.body.length.should.equal(1);
              response.body[0].should.have.property('port_total_ships');
              response.body[0].port_total_ships.should.not.equal(118);
              response.body[0].port_total_ships.should.equal(232);

              chai.request(server)
                .get('/api/v1/ports/10')
                .set('Authorization', token)
                .end( (error, response) => {
                  response.should.have.status(200);
                  response.body.should.be.a('array');
                  response.body.length.should.equal(1);
                  done();
                });
            });
        });
    });

    it('Should not update the port database when trying to update a parameter that cannot be changed', (done) => {
      chai.request(server)
        .get('/api/v1/ports/10')
        .set('Authorization', token)
        .end( (error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body[0].should.have.property('port_country');
          response.body[0].port_country.should.equal('Russia');

          chai.request(server)
            .patch('/api/v1/ports/10')
            .set('Authorization', token)
            .send({ country: 'USA' })
            .end( (error, response) => {
              response.should.have.status(422);
              response.body.error.should.equal('Expected format: { port_max_vessel_size: <String>, port_total_ships: <Integer>.');

              chai.request(server)
                .get('/api/v1/ports/10')
                .set('Authorization', token)
                .end( (error, response) => {
                  response.should.have.status(200);
                  response.should.be.json;
                  response.body[0].should.have.property('port_country');
                  response.body[0].port_country.should.equal('Russia');
                  done();
                });
            });
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

              chai.request(server)
                .get('/api/v1/port-usage')
                .set('Authorization', token)
                .end( (error, response) => {
                  response.should.have.status(200);
                  response.body.should.be.a('array');
                  response.body.length.should.equal(2);
                  done();
                });
            });
        });
    });

    it('should not delete a port from database if incorrect id is submitted', (done) => {
      chai.request(server)
        .delete('/api/v1/ports/99')
        .set('Authorization', token)
        .end((error, response) => {
          response.should.have.status(404);
          response.body.error.should.equal('A port matching the id submitted could not be found.');
          done();
        });
    });
  });


});
