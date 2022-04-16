const { gameDetailApiOrDDBB, createVideogame } = require("../Services/Videogame");


module.exports = {
  GET_VIDEOGAME_BY_ID: async (req, res) => {
    /*Indicaciones
    Obtener el detalle de un videojuego en particular
    Debe traer solo los datos pedidos en la ruta de detalle de videojuego
    Incluir los géneros asociados*/
    const { idVideogame } = req.params;
    
    try {
      let gameDetails = await gameDetailApiOrDDBB(idVideogame) ;
      
      res.json(gameDetails);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  
  CREATE_VIDEOGAME: async (req, res) => {
    /*Indicaciones
    Recibe los datos recolectados desde el formulario controlado de la ruta de creación de videojuego por body
    Crea un videojuego en la base de datos
    Nombre
    Descripción
    Fecha de lanzamiento
    Rating*/
    let { name, description, released, rating, genres, platforms, background_image } = req.body;
    
    try {
      if(!name || !description || !platforms.length) throw ({err: "To create a videogame must complete properties name, descrption and platforms"
    });
      let newVideogame = await createVideogame(name, description, released, rating, genres, platforms, background_image);
      
      res.json(newVideogame);
    } catch (err) {
      res.status(400).send(err);
    }
  },
};