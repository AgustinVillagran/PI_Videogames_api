const { findVideogame, getAllVideogames } = require("../Services/Videogames");

module.exports = {
  GET_ALL_VIDEOGAMES: async (req, res, next) => {
    /*Indicaciones
    Obtener un listado de los videojuegos
    Debe devolver solo los datos necesarios para la ruta principal
    Imagen
    Nombre
    Géneros*/

    if (req.query.name) next();
      else {
        try{
          const listVideogames = await getAllVideogames();
          
          res.json(listVideogames);
      } catch (err) {
        throw new Error(err);
      }
    }
  },

  GET_VIDEOGAMES_BY_NAME: async (req, res) => {
    /* Indicaciones
    Obtener un listado de las primeros 15 videojuegos que contengan la palabra ingresada como query parameter
    Si no existe ningún videojuego mostrar un mensaje adecuado
    */
  const { name } = req.query;

    try {
      let gamesFounded = await findVideogame(name)

      res.json(gamesFounded);
    } catch (e) {
      res.status(400).send(e);
    }
  },
};
