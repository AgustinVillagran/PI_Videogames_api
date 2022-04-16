const { getGenresFromApiOrDDBB } = require("../Services/Genres");

module.exports = {
  GET_GENRES: async (req, res) => {
    /* Indicaciones
    Obtener todos los tipos de géneros de videojuegos posibles
    En una primera instancia deberán traerlos desde rawg y guardarlos en su propia base de datos y luego ya utilizarlos desde allí*/
    
    try {
      const genresList = await getGenresFromApiOrDDBB()
  
      res.json(genresList)
    } catch (e) {
      res.status(400).send(e);
    }
  },
};