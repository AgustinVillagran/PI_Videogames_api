const { default: axios } = require("axios");
const {Videogame, Genre} = require("../db");
const {DB_API_KEY} = process.env;

module.exports={
  async gameDetailApiOrDDBB(idVideogame){
    const WRONG_ID = "Ups! This ID doesn't exist :)."
    try {
      let gameDetail;

      if(idVideogame.includes("-")){
        gameDetail = (await Videogame.findOne({
          where:{
            id: idVideogame,
          },attributes: [
            "name",
            "background_image",
            "description",
            "released",
            "rating",
            "platforms"],
            include:{
              model:Genre,
              attributes:["name"],
              through:{
                attributes:[],
              }
            }
        })).toJSON();

        gameDetail= {
          name:gameDetail.name,
          background_image: gameDetail.background_image,
          description: gameDetail.description,
          released: gameDetail.released,
          rating: gameDetail.rating,
          platforms: gameDetail.platforms,
          genres: gameDetail.genres.map(el=>el.name)
        }

      }else{
        const NAME_NOT_AVAILABLE = "Name is not available, sorry :).";
        const DESCRIPTION_UNDEF = "Description is not available, sorry :).";
        const RELEASED_UNDEF = "Released is not available, sorry :).";
        const RATING_UNDEF = "Rating is not available, sorry :).";
        const GENRE_UNDEF = ["Genres are not availables, sorry :)"];
        const URL_IMAGE_NOT_AVAILABLE = "https://www.feednavigator.com/var/wrbm_gb_food_pharma/storage/images/_aliases/news_large/9/2/8/5/235829-6-eng-GB/Feed-Test-SIC-Feed-20142.jpg";
        const PLATFORMS_UNDEF = ["Platforms are not availables, sorry :)"]
        const URL_GAME_ID = `https://api.rawg.io/api/games/${idVideogame}?key=${DB_API_KEY}`;
    
        let {
          name,
          background_image,
          genres,
          description_raw,
          released,
          rating,
          platforms,
        } = (await axios(URL_GAME_ID)).data;

        gameDetail = {
          name: name? 
            name 
            : NAME_NOT_AVAILABLE,
          background_image: background_image? 
            background_image 
            : URL_IMAGE_NOT_AVAILABLE,
          genres: genres?.length
            ? genres.map((le) => {
                return le.name;
              })
            : GENRE_UNDEF,
          description: description_raw?
            description_raw
            : DESCRIPTION_UNDEF,
          released: released? 
            released
            : RELEASED_UNDEF,
          rating: rating?
            rating
            : RATING_UNDEF,
          platforms: platforms?.length?
            platforms.map((le) => {return le.platform.name})
            :PLATFORMS_UNDEF,
        };
      };

      return gameDetail
      ? gameDetail
      : WRONG_ID;
    } catch (err) {
      throw err;
    }
  },
  async createVideogame(name, description, released, rating, genres, platforms, background_image){
    try {
      const newVideogame = await Videogame.create({
        name,
        description,
        released, // "YYYY-MM-DD","MM/DD/YYYY"
        rating,
        platforms,
        background_image,
      });
  
      const genresCreated = await Promise.all(genres.map(async le => {
        await newVideogame.addGenre([(await Genre.findOrCreate({
          where:{
            name: le
          }
        }))[0].dataValues.id]);
      }));
  
      let videogameJoinGenres = (await Videogame.findOne({
        where:{
          name: newVideogame.name,          
        },
        attributes:["id", "name", "description", "released", "rating", "platforms", "background_image"],
        include:{
          model: Genre,
          attributes:["name"],
          through:{
            attributes:[]
          }
        } 
      })).toJSON();
  
      videogameJoinGenres.genres = genres.map(la => la);
      
      return videogameJoinGenres;
    } catch (err) {
      throw err;
    }
  }
  
}