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

describe('Ship Routes', () => {

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
          response.body.forEach( elem => {
            elem.should.have.property('id');
            elem.should.have.property('ship_name');
            elem.should.have.property('ship_country');
            elem.should.have.property('ship_type');
            elem.should.have.property('ship_length');
            elem.should.have.property('ship_imo');
            elem.should.have.property('ship_status');
            elem.should.have.property('ship_mmsi_callsign');
            elem.should.have.property('ship_current_port');
          });
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

  describe('POST /api/v1/ships', () => {
    it('should post a new ship to the database', (done) => {
      const mockObject = {
        id: 11,
        ship_status: 'moored',
        ship_imo: '8978116',
        ship_length: '105x16m',
        ship_mmsi_callsign: '273626900\nUDLE',
        ship_current_port: 10,
        ship_country: 'Russia',
        ship_name: 'JARGO',
        ship_type: 'Trawler'
      };

      chai.request(server)
        .post('/api/v1/ships')
        .set('Authorization', token)
        .send(mockObject)
        .end( (error, response) => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.include(mockObject);

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
      };

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

  describe('PATCH /api/v1/ships/:id', () => {
    it('Should update the ships database with a patch request', (done) => {
      chai.request(server)
        .get('/api/v1/ships/1')
        .set('Authorization', token)
        .end( (error, response) => {
          response.should.have.status(200);
          response.body[0].should.have.property('ship_status');
          response.body[0].ship_status.should.equal('moored');

          chai.request(server)
            .patch('/api/v1/ships/1')
            .set('Authorization', token)
            .send({ ship_status: 'underway using engine' })
            .end( (error, response) => {
              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a('array');
              response.body.length.should.equal(1);
              response.body[0].should.have.property('ship_status');
              response.body[0].ship_status.should.not.equal('moored');
              response.body[0].ship_status.should.equal('underway using engine');
              done();
            });
        });
    });

    it('Should not update the ships database when trying to update a parameter that cannot be changed', (done) => {
      chai.request(server)
        .get('/api/v1/ships/1')
        .set('Authorization', token)
        .end( (error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body[0].should.have.property('ship_name');
          response.body[0].ship_name.should.equal('IRBIS');

          chai.request(server)
            .patch('/api/v1/ships/1')
            .set('Authorization', token)
            .send({ ship_name: 'Boaty McBoatface' })
            .end( (error, response) => {
              response.should.have.status(422);
              response.should.be.json;
              response.body.error.should.equal('Expected format: { ship_country: <String>, ship_type: <String>, ship_status: <String>, <String>, ship_current_port: <Integer> }. You\'re missing a valid property.');

              chai.request(server)
                .get('/api/v1/ships/1')
                .set('Authorization', token)
                .end( (error, response) => {
                  response.should.have.status(200);
                  response.should.be.json;
                  response.body[0].should.have.property('ship_name');
                  response.body[0].ship_name.should.equal('IRBIS');
                  done();
                });
            });
        });
    });
  });

  describe('DELETE /api/v1/ships/:id', () => {
    it('should delete a ship from database', (done) => {
      chai.request(server)
        .delete('/api/v1/ships/7')
        .set('Authorization', token)
        .end((error, response) => {
          response.should.have.status(204);

          chai.request(server)
            .get('/api/v1/ships')
            .set('Authorization', token)
            .end((error, response) => {
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
        .end((error, response) => {
          response.should.have.status(404);
          response.body.error.should.equal('A ship matching the id submitted could not be found.');
          done();
        });
    });
  });


});
