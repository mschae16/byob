const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

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

    describe('GET /api/v1/ports', () => {
      it('should retrieve all ports', (done) => {
        chai.request(server)
          .get('/api/v1/ports')
          .end( (error, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('array');
            response.body.length.should.equal(6);
            response.body[0].should.have.property('port_name');
            done();
          });
      });
    });

});
