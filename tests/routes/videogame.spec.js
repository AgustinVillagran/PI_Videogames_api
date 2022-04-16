/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Videogame, conn } = require('../../src/db.js');

const agent = session(app);
const videogameOk = {
  "name": "sdfdsHenry4 hdfsdjh",
  "background_image": "https://external-preview.redd.it/AfshAWaqQt3a6q9QU2P1oWMvsUTOn1iPiLeEiqSdbi4.jpg?auto=webp&s=7a0423803bc1a2414a28029a5754dce94968413d",
  "genres": [
    "Action",
    "Adventure",
    "Educational",
    "Massively Multiplayer",
    "Strategy",
    "RPG"
  ],
  "description": "En este contexto, nació en la Argentina prepandemia una academia sin aulas ni matrículas...",
  "released": "2015-09-23",
  "rating": 2.78,
  "platforms": [
    "Wii U",
    "PlayStation 3",
    "PlayStation 4",
    "PC",
    "Xbox One",
    "macOS"
  ]
};
const videogameWithoutName = {
  "name":"",
  "background_image": "https://external-preview.redd.it/AfshAWaqQt3a6q9QU2P1oWMvsUTOn1iPiLeEiqSdbi4.jpg?auto=webp&s=7a0423803bc1a2414a28029a5754dce94968413d",
  "genres": [
    "Action",
    "Adventure",
    "Educational",
    "Massively Multiplayer",
    "Strategy",
    "RPG"
  ],
  "description": "En este contexto, nació en la Argentina prepandemia una academia sin aulas ni matrículas...",
  "released": "2015-09-23",
  "rating": 2.78,
  "platforms": [
    "Wii U",
    "PlayStation 3",
    "PlayStation 4",
    "PC",
    "Xbox One",
    "macOS"
  ]
};
const videogameWithoutPlatforms = {
  "name":"Henry",
  "background_image": "https://external-preview.redd.it/AfshAWaqQt3a6q9QU2P1oWMvsUTOn1iPiLeEiqSdbi4.jpg?auto=webp&s=7a0423803bc1a2414a28029a5754dce94968413d",
  "genres": [
    "Action",
    "Adventure",
    "Educational",
    "Massively Multiplayer",
    "Strategy",
    "RPG"
  ],
  "description": "En este contexto, nació en la Argentina prepandemia una academia sin aulas ni matrículas...",
  "released": "2015-09-23",
  "rating": 2.78,
  "platforms": []
};
const videogameWithoutDescription = {
  "name":"Henry",
  "background_image": "https://external-preview.redd.it/AfshAWaqQt3a6q9QU2P1oWMvsUTOn1iPiLeEiqSdbi4.jpg?auto=webp&s=7a0423803bc1a2414a28029a5754dce94968413d",
  "genres": [
    "Action",
    "Adventure",
    "Educational",
    "Massively Multiplayer",
    "Strategy",
    "RPG"
  ],
  "description": "",
  "released": "2015-09-23",
  "rating": 2.78,
  "platforms": [
    "Wii U",
    "PlayStation 3",
    "PlayStation 4",
    "PC",
    "Xbox One",
    "macOS"
  ]
};

describe('Videogame routes', () => {
  before(() => conn.authenticate()
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  }));
  beforeEach(() => Videogame.sync({ force: true })
    .then(() => Videogame.create(videogameOk)));
  describe('GET /videogames', () => {
    it('should get 200', async () =>
      await agent.get('/videogames')
      .expect(200)
    );
  });
  describe('GET /genres', () => {
    it('should get 200', async () =>
      await agent.get('/genres')
      .expect(200)
    );
  });
  describe('GET /videogames?name=xxxx', () => {
    it('should get 200', async () =>
      await agent.get('/videogames?name=spiderman')
      .expect(200)
    );
  });
  describe('GET /videogames/:id', () => {
    it('should get 200', async () =>
      await agent.get('/videogame/333')
      .expect(200)
    );
  });
  describe('POST /videogame', () => {
    it('Debería permitir crear un Videogame pasandole los datos necesarios', async () =>
      await agent.get('/videogames')
      .send(videogameOk)
      .expect(200) 
    );
    it('No debería permitir crear un Videogame sin name', async () =>
      await agent.post('/videogame')
      .send(videogameWithoutName)
      .expect(400) 
    );
    it('No debería permitir crear un Videogame sin description', async () =>
      await agent.post('/videogame')
      .send(videogameWithoutPlatforms)
      .expect(400) 
    );
    it('No debería permitir crear un Videogame sin platforms', async () =>
      await agent.post('/videogame')
      .send(videogameWithoutDescription)
      .expect(400) 
    );
  });
});
