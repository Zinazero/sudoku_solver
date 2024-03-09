const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  test('Solve a puzzle with valid puzzle string', function (done) {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
        done();
      });
  });
  test('Solve a puzzle with missing puzzle string', function (done) {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field missing");
        done();
      });
  });
  test('Solve a puzzle with invalid characters', function (done) {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '1F5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });
  test('Solve a puzzle with incorrect length', function (done) {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
        done();
      });
  });
  test('Solve a puzzle that cannot be solved', function (done) {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '1555.2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Puzzle cannot be solved");
        done();
      });
  });
  test('Check a puzzle placement with all fields', function (done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2', value: '3' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isTrue(res.body.valid);
        done();
      });
  });
  test('Check a puzzle placement with single placement conflict', function (done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2', value: '4' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.deepEqual(res.body.conflict, ["row"]);
        done();
      });    
  });
  test('Check a puzzle placement with multiple placement conflicts', function (done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2', value: '1' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.deepEqual(res.body.conflict, ["row", "region"]);
        done();
      });  
  });
  test('Check a puzzle placement with all placement conflicts', function (done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2', value: '2' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.deepEqual(res.body.conflict, ["row", "column", "region"]);
        done();
      });  
  });
  test('Check a puzzle placement with missing required fields', function (done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '', coordinate: 'A2', value: '3' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });
  test('Check a puzzle placement with invalid characters', function (done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '1F5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2', value: '3' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });
  test('Check a puzzle placement with incorrect length', function (done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....', coordinate: 'A2', value: '3' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
        done();
      });    
  });
  test('Check a puzzle placement with invalid placement coordinate', function (done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'M16', value: '3' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid coordinate");
        done();
      });
  });
  test('Check a puzzle placement with invalid placement coordinate', function (done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2', value: '33' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid value");
        done();
      });
  });
  after(function() {
    chai.request(server)
      .get('/')
  });
});

