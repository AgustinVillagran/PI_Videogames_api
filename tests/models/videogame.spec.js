const { Videogame, conn } = require('../../src/db.js');
const { expect } = require('chai');

describe('Videogame model', () => {
  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
  describe('Validators', () => {
    beforeEach(() => Videogame.sync({ force: true }));
    describe('name', () => {
      it('should throw an error if name is null', (done) => {
        Videogame.create({name:null})
          .then(() => done(new Error('It requires a valid name')))
          .catch((err) => done(console.error(err)));
      });
      it('should work when its a valid name', (done) => {
        Videogame.create({ name: 'Super Mario Bros' })
        .then((data)=>done(console.log(data)))
        .catch((err) => done(console.error(err)));
      });
    });
  });
});
