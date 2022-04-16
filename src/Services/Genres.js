const { default: axios } = require("axios");
const { Genre } = require("../db");
const {DB_API_KEY} = process.env;

module.exports={
  async getGenresFromApiOrDDBB(){
    const URL_GENRES = `https://api.rawg.io/api/genres?key=${DB_API_KEY}`;
      let genresList = (await axios(URL_GENRES)).data.results.map( el => {
        return el.name;
      });
      
      genresList = await Promise.all(genresList.map( async le =>{ 
        return (await Genre.findOrCreate({
          where:{
            name:le,
          },
        }))[0].dataValues.name;
      }));

      return genresList
  }
  
}