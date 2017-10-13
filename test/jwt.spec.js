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

  describe('Retrieve a single port with jwt', () => {
    it('GET port - jwt passed in query params', (done) => {
      chai.request(server)
        .get(`/api/v1/ports/20?token=${userToken}`)
        .end( (error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          done();
        });
    });

    it('GET port - jwt passed in request body', (done) => {
      chai.request(server)
        .get('/api/v1/ports/20')
        .send({ token: userToken })
        .end( (error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          done();
        });
    });

    it('GET port - jwt passed in headers', (done) => {
      chai.request(server)
        .get('/api/v1/ports/20')
        .set('Authorization', userToken)
        .end( (error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          done();
        });
    });

    it('returns an error if no jwt', (done) => {
      chai.request(server)
        .get('/api/v1/ports/20')
        .end( (error, response) => {
          response.should.have.status(403);
          response.body.error.should.equal('You must be authorized to hit this endpoint.')
          done();
        });
    });
  });

  describe('Retrieve single ship with jwt', () => {
    it('GET ship - jwt passed in query params', (done) => {
      chai.request(server)
        .get(`/api/v1/ships/7?token=${userToken}`)
        .end( (error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          done();
        });
    });

    it('GET ship - jwt passed in request body', (done) => {
      chai.request(server)
        .get('/api/v1/ships/7')
        .send({ token: userToken })
        .end( (error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          done();
        });
    });

    it('GET ship - jwt passed in headers', (done) => {
      chai.request(server)
        .get('/api/v1/ships/7')
        .set('Authorization', userToken)
        .end( (error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          done();
        });
    });

    it('returns an error if no jwt', (done) => {
      chai.request(server)
        .get('/api/v1/ships/7')
        .end( (error, response) => {
          response.should.have.status(403);
          response.body.error.should.equal('You must be authorized to hit this endpoint.')
          done();
        });
    });
  });

  describe('Post new port with jwt', () => {
    const mockData = {
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

    it('POST port - jwt passed in query params', (done) => {
      chai.request(server)
        .post(`/api/v1/ports?token=${adminToken}`)
        .send(mockData)
        .end( (error, response) => {
          response.should.have.status(201);
          done();
        });
    });

    it('POST port - jwt passed in request body', (done) => {
      chai.request(server)
        .post('/api/v1/ports')
        .send(Object.assign({}, mockData, { token: adminToken }))
        .end( (error, response) => {
          response.should.have.status(201);
          done();
        });
    });

    it('POST port - jwt passed in headers', (done) => {
      chai.request(server)
        .post('/api/v1/ports')
        .set('Authorization', adminToken)
        .send(mockData)
        .end( (error, response) => {
          response.should.have.status(201);
          done();
        });
    });

    it('returns error if missing jwt', (done) => {
      chai.request(server)
        .post('/api/v1/ports')
        .send(mockData)
        .end( (error, response) => {
          response.should.have.status(403);
          response.body.error.should.equal('You must be authorized to hit this endpoint.')
          done();
        });
    });

    it('returns error if missing admin privileges', (done) => {
      chai.request(server)
        .post('/api/v1/ports')
        .set('Authorization', userToken)
        .send(mockData)
        .end( (error, response) => {
          response.should.have.status(403);
          response.body.error.should.equal('You are not authorized to have write access to this endpoint.');
          done();
        });
    });
  });

  describe('Post new ship with jwt', () => {
    const mockShip = {
      ship_status: 'moored',
      ship_imo: '8978116',
      ship_length: '105x16m',
      ship_mmsi_callsign: '273626900\nUDLE',
      ship_current_port: 10,
      ship_country: 'Russia',
      ship_name: 'JARGO',
      ship_type: 'Trawler'
    }

    it('POST ship - jwt passed in query params', (done) => {
      chai.request(server)
        .post(`/api/v1/ships?token=${adminToken}`)
        .send(mockShip)
        .end( (error, response) => {
          response.should.have.status(201);
          done();
        });
    });

    it('POST ship - jwt passed in request body', (done) => {
      chai.request(server)
        .post('/api/v1/ships')
        .send(Object.assign({}, mockShip, { token: adminToken }))
        .end( (error, response) => {
          response.should.have.status(201);
          done();
        });
    });

    it('POST ship - jwt passed in headers', (done) => {
      chai.request(server)
        .post('/api/v1/ships')
        .set('Authorization', adminToken)
        .send(mockShip)
        .end( (error, response) => {
          response.should.have.status(201);
          done();
        });
    });

    it('returns error if missing jwt', (done) => {
      chai.request(server)
        .post('/api/v1/ships')
        .send(mockShip)
        .end( (error, response) => {
          response.should.have.status(403);
          response.body.error.should.equal('You must be authorized to hit this endpoint.')
          done();
        });
    });

    it('returns error if missing admin privileges', (done) => {
      chai.request(server)
        .post('/api/v1/ships')
        .set('Authorization', userToken)
        .send(mockShip)
        .end( (error, response) => {
          response.should.have.status(403);
          response.body.error.should.equal('You are not authorized to have write access to this endpoint.')
          done();
        });
    });
  });

  // do last
  // describe('Delete a port with jwt', () => {
  //   it('DELETE port - jwt passed in query params', (done) => {
  //     chai.request(server)
  //       .delete(`/api/v1/ports/10?token=${adminToken}`)
  //       .end( (error, response) => {
  //         response.should.have.status(204);
  //         done();
  //       });
  //   });
  //
  //   it('DELETE port - jwt passed in request body', (done) => {
  //     chai.request(server)
  //       .delete('/api/v1/ports/10')
  //       .send({ token: adminToken })
  //       .end( (error, response) => {
  //         response.should.have.status(204);
  //         done();
  //       });
  //   });
  //
  //   it('DELETE port - jwt passed in headers', (done) => {
  //     chai.request(server)
  //       .delete('/api/v1/ports/10')
  //       .set('Authorization', adminToken)
  //       .end( (error, response) => {
  //         response.should.have.status(204);
  //         done();
  //       });
  //   });
  //
  //   it('returns error if missing jwt', (done) => {
  //     chai.request(server)
  //       .delete('/api/v1/ports/10')
  //       .end( (error, response) => {
  //         response.should.have.status(403);
  //         response.body.error.should.equal('You must be authorized to hit this endpoint.');
  //         done();
  //       });
  //   });
  //
  //   it('returns error if missing admin privileges', (done) => {
  //     chai.request(server)
  //       .delete('/api/v1/ports/10')
  //       .set('Authorization', userToken)
  //       .end( (error, response) => {
  //         response.should.have.status(403);
  //         response.body.error.should.equal('You are not authorized to have write access to this endpoint.');
  //         done();
  //       });
  //   });
  // });

  describe('Delete single ship with jwt', () => {
    it('DELETE ship - jwt passed in query params', (done) => {
      chai.request(server)
        .delete(`/api/v1/ships/3?token=${adminToken}`)
        .end( (error, response) => {
          response.should.have.status(204);
          done();
        });
    });

    it('DELETE ship - jwt passed in request body', (done) => {
      chai.request(server)
        .delete('/api/v1/ships/3')
        .send({ token: adminToken })
        .end( (error, response) => {
          response.should.have.status(204);
          done();
        });
    });

    it('DELETE ship - jwt passed in headers', (done) => {
      chai.request(server)
        .delete('/api/v1/ships/3')
        .set('Authorization', adminToken)
        .end( (error, response) => {
          response.should.have.status(204);
          done();
        });
    });

    it('returns error if jwt is missing', (done) => {
      chai.request(server)
        .delete('/api/v1/ships/3')
        .end( (error, response) => {
          response.should.have.status(403);
          response.body.error.should.equal('You must be authorized to hit this endpoint.');
          done();
        });
    });

    it('returns error if missing admin privileges', (done) => {
      chai.request(server)
        .delete('/api/v1/ships/3')
        .set('Authorization', userToken)
        .end( (error, response) => {
          response.should.have.status(403);
          response.body.error.should.equal('You are not authorized to have write access to this endpoint.');
          done();
        });
    });
  });

  describe('Patch single port with jwt', () => {
    const patchData = {
        port_total_ships: 232
    }

    it('PATCH port - jwt passed in query params', (done) => {
      chai.request(server)
        .patch(`/api/v1/ports/10?token=${adminToken}`)
        .send(patchData)
        .end( (error, response) => {
          response.should.have.status(200);
          done();
        });
    });

    it('PATCH port - jwt passed in request body', (done) => {
      chai.request(server)
        .patch('/api/v1/ports/10')
        .send(Object.assign({}, patchData, { token: adminToken }))
        .end( (error, response) => {
          response.should.have.status(200);
          done();
        });
    });

    it('PATCH port - jwt passed in headers', (done) => {
      chai.request(server)
        .patch('/api/v1/ports/10')
        .set('Authorization', adminToken)
        .send(patchData)
        .end( (error, response) => {
          response.should.have.status(200);
          done();
        });
    });

    it('returns error if missing jwt', (done) => {
      chai.request(server)
        .patch('/api/v1/ports/10')
        .send(patchData)
        .end( (error, response) => {
          response.should.have.status(403)
          response.body.error.should.equal('You must be authorized to hit this endpoint.');
          done();
        });
    });

    it('returns error if missing admin privileges', (done) => {
      chai.request(server)
        .patch('/api/v1/ports/10')
        .set('Authorization', userToken)
        .send(patchData)
        .end( (error, response) => {
          response.should.have.status(403)
          response.body.error.should.equal('You are not authorized to have write access to this endpoint.')
          done();
        });
    });
  });

  describe('Patch single ship with jwt', () => {
    const patchShip = {
      ship_status: 'underway using engine'
    }

    it('PATCH ship - jwt passed in query params', (done) => {
      chai.request(server)
        .patch(`/api/v1/ships/4?token=${adminToken}`)
        .send(patchShip)
        .end( (error, response) => {
          response.should.have.status(200);
          done();
        });
    });

    it('PATCH ship - jwt passed in request body', (done) => {
      chai.request(server)
        .patch('/api/v1/ships/4')
        .send(Object.assign({}, patchShip, { token: adminToken }))
        .end( (error, response) => {
          response.should.have.status(200);
          done();
        });
    });

    it('PATCH ship - jwt passed in headers', (done) => {
      chai.request(server)
        .patch('/api/v1/ships/4')
        .set('Authorization', adminToken)
        .send(patchShip)
        .end( (error, response) => {
          response.should.have.status(200);
          done();
        });
    });

    it('returns error if missing jwt', (done) => {
      chai.request(server)
        .patch('/api/v1/ships/4')
        .send(patchShip)
        .end( (error, response) => {
          response.should.have.status(403)
          response.body.error.should.equal('You must be authorized to hit this endpoint.');
          done();
        });
    });

    it('returns error if missing admin privileges', (done) => {
      chai.request(server)
        .patch('/api/v1/ships/4')
        .set('Authorization', userToken)
        .send(patchShip)
        .end( (error, response) => {
          response.should.have.status(403)
          response.body.error.should.equal('You are not authorized to have write access to this endpoint.')
          done();
        });
    });
  });

  describe('Put-update port-usage with jwt', () => {
    const putData = {
      cargo_vessels: '10%',
      fishing_vessels: '10%',
      various_vessels: '10%',
      tanker_vessels: '10%',
      tug_offshore_supply_vessels: '10%',
      passenger_vessels: '10%',
      authority_military_vessels: '10%',
      sailing_vessels: '10%',
      aid_to_nav_vessels: '10%'
    }

    it('PUT port-usage - jwt passed in query params', (done) => {
      chai.request(server)
        .put(`/api/v1/port-usage/10?token=${adminToken}`)
        .send(putData)
        .end( (error, response) => {
          response.should.have.status(200);
          done();
        });
    });

    it('PUT port-usage - jwt passed in request body', (done) => {
      chai.request(server)
        .put('/api/v1/port-usage/10')
        .send(Object.assign({}, putData, { token: adminToken }))
        .end( (error, response) => {
          response.should.have.status(200);
          done();
        });
    });

    it('PUT port-usage - jwt passed in headers', (done) => {
      chai.request(server)
        .put('/api/v1/port-usage/10')
        .set('Authorization', adminToken)
        .send(putData)
        .end( (error, response) => {
          response.should.have.status(200);
          done();
        });
    });

    it('returns error if missing jwt', (done) => {
      chai.request(server)
        .put('/api/v1/port-usage/10')
        .send(putData)
        .end( (error, response) => {
          response.should.have.status(403)
          response.body.error.should.equal('You must be authorized to hit this endpoint.');
          done();
        });
    });

    it('returns error if missing admin privileges', (done) => {
      chai.request(server)
        .put('/api/v1/port-usage/10')
        .set('Authorization', userToken)
        .send(putData)
        .end( (error, response) => {
          response.should.have.status(403)
          response.body.error.should.equal('You are not authorized to have write access to this endpoint.')
          done();
        });
    });
  });


});
