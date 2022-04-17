require('dotenv').config();
const { Sequelize, DataTypes, UUIDV4 } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;

let sequelize = process.env.NODE_ENV === "production"
? new Sequelize(process.env.DATABASE_URL, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  dialectOptions: {
    ssl: {
      require: true,
      // Ref.: https://github.com/brianc/node-postgres/issues/2009
      rejectUnauthorized: false,
    },
    keepAlive: true,
  },
  ssl: true,
})
: new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/Models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/Models', file)));
  });

// Injectamos la conexion (sequelize), DataTypes y UUIDV4 a todos los modelos
modelDefiners.forEach(model => model(sequelize, DataTypes, UUIDV4));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

const { Videogame, Genre } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);
Videogame.belongsToMany(Genre,{through:'Games_Per_Genre'});
Genre.belongsToMany(Videogame,{through: 'Games_Per_Genre'});

module.exports = {
  ...sequelize.models,  // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importar la conexión { conn } = require('./db.js');
};
