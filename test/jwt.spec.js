const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const jwt = require('jsonwebtoken');
const should = chai.should();

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const localKey = process.env.SECRET_KEY || require('../key.js');

const adminToken = jwt.sign({ email: 'test@turing.io', appName: 'Jargo', admin: true }, localKey);
const userToken = jwt.sign({ email: 'test@gmail.com', appName: 'Jargo', admin: false }, localKey);

describe('JWT middleware', () => {

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

  describe('Retrieve ports with jwt', () => {
    it('GET ports - jwt passed in query params', (done) => {
      chai.request(server)
        .get(`/api/v1/ports?token=${userToken}`)
        .end( (error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          done();
        });
    });

    it('GET ports - jwt passed in request body', (done) => {
      chai.request(server)
        .get('/api/v1/ports')
        .send({ token: userToken })
        .end( (error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          done();
        });
    });

    it('GET ports - jwt passed in headers', (done) => {
      chai.request(server)
        .get('/api/v1/ports')
        .set('Authorization', userToken)
        .end( (error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          done();
        });
    });

    it('returns an error if no jwt', (done) => {
      chai.request(server)
        .get('/api/v1/ports')
        .end( (error, response) => {
          response.should.have.status(403);
          response.body.error.should.equal('You must be authorized to hit this endpoint.');
          done();
        });
    });

  });

  describe('Retrieve port-usage with jwt', () => {
    it('GET port-usage - jwt passed in query params', (done) => {
      chai.request(server)
        .get(`/api/v1/port-usage?token=${userToken}`)
        .end( (error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          done();
        });
    });

    it('GET port-usage - jwt passed in request body', (done) => {
      chai.request(server)
        .get('/api/v1/port-usage')
        .send({ token: userToken })
        .end( (error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          done();
        });
    });

    it('GET port-usage - jwt passed in headers', (done) => {
      chai.request(server)
        .get('/api/v1/port-usage')
        .set('Authorization', userToken)
        .end( (error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          done();
        });
    });

    it('returns an error if no jwt', (done) => {
      chai.request(server)
        .get('/api/v1/port-usage')
        .end( (error, response) => {
          response.should.have.status(403);
          response.body.error.should.equal('You must be authorized to hit this endpoint.');
          done();
        });
    });
  });

  describe('Retrieve ships with jwt', () => {
    it('GET ships - jwt passed in query params', (done) => {
      chai.request(server)
        .get(`/api/v1/ships?token=${userToken}`)
        .end( (error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(10);
          done();
        });
    });

    it('GET ships - jwt passed in request body', (done) => {
      chai.request(server)
        .get('/api/v1/ships')
        .send({ token: userToken })
        .end( (error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(10);
          done();
        });
    });

    it('GET ships - jwt passed in headers', (done) => {
      chai.request(server)
        .get('/api/v1/ships')
        .set('Authorization', userToken)
        .end( (error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(10);
          done();
        });
    });

    it('returns an error if no jwt', (done) => {
      chai.request(server)
        .get('/api/v1/ships')
        .end( (error, response) => {
          response.should.have.status(403);
          response.body.error.should.equal('You must be authorized to hit this endpoint.');
          done();
        });
    });

  });

  // describe('Retrieve single port with jwt', () => {
  //
  // })
  //
  // describe('Retrieve single ship with jwt', () => {
  //
  // });
  //
  // describe('Post new port with jwt', () => {
  //
  // });
  //
  // describe('Post new ship with jwt', () => {
  //
  // });
  //
  // // do last
  // describe('Delete a port with jwt', () => {
  //
  // });
  //
  // describe('Delete a ship with jwt', () => {
  //
  // });
  //
  // describe('Patch single port with jwt', () => {
  //
  // });
  //
  // describe('Patch single ship with jwt', () => {
  //
  // });
  //
  // describe('Put-update port-usage with jwt', () => {
  //
  // });



});
