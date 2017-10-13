const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const jwt = require('jsonwebtoken');
/* eslint-disable no-alert, no-unused-vars */
const should = chai.should();
/* eslint-enable no-alert, no-unused-vars */
require('dotenv').config();

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const token = jwt.sign({ email: 'test@turing.io', app_name: 'Jargo', admin: true }, process.env.SECRET_KEY);

chai.use(chaiHttp);

describe('Port Usage Routes', () => {

  before((done) => {
    database.migrate.latest()
      .then(() => done())
    /* eslint-disable no-alert, no-console */
      .catch((error) => console.log(error));
    /* eslint-enable no-alert, no-console */
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
    /* eslint-disable no-alert, no-console */
      .catch((error) => console.log(error));
    /* eslint-enable no-alert, no-console */
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
          response.body.forEach( elem => {
            elem.should.have.property('cargo_vessels');
            elem.should.have.property('fishing_vessels');
            elem.should.have.property('various_vessels');
            elem.should.have.property('tanker_vessels');
            elem.should.have.property('tug_offshore_supply_vessels');
            elem.should.have.property('passenger_vessels');
            elem.should.have.property('authority_military_vessels');
            elem.should.have.property('sailing_vessels');
            elem.should.have.property('aid_to_nav_vessels');
            elem.should.have.property('port_id');
          });
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

  describe('PUT /api/v1/port-usage/:id', () => {
    it('should update all values in port-usage table', (done) => {
      const mockObject = {
        cargo_vessels: '10%',
        fishing_vessels: '10%',
        various_vessels: '10%',
        tanker_vessels: '10%',
        tug_offshore_supply_vessels: '10%',
        passenger_vessels: '10%',
        authority_military_vessels: '10%',
        sailing_vessels: '10%',
        aid_to_nav_vessels: '10%'
      };

      chai.request(server)
        .put('/api/v1/port-usage/20')
        .set('Authorization', token)
        .send(mockObject)
        .end( (error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('port_id');
          response.body[0].port_id.should.equal(20);
          response.body[0].should.include(mockObject);
          done();
        });
    });

    it('should not update any values if missing information', (done) => {
      const mockObject = {
        cargo_vessels: '10%',
        fishing_vessels: '10%',
        various_vessels: '10%',
        tanker_vessels: '10%',
        tug_offshore_supply_vessels: '10%',
        authority_military_vessels: '10%',
        sailing_vessels: '10%',
        aid_to_nav_vessels: '10%'
      };

      chai.request(server)
        .put('/api/v1/port-usage/20')
        .set('Authorization', token)
        .send(mockObject)
        .end( (error, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('Expected format: { cargo_vessels: <String>, fishing_vessels: <String>, various_vessels: <String>, tanker_vessels: <String>, tug_offshore_supply_vessels: <String>, passenger_vessels: <String>, authority_military_vessels: <String>, sailing_vessels: <String>, aid_to_nav_vessels: <String> }. You\'re missing a passenger_vessels property.');
          done();
        });
    });
  });


});
