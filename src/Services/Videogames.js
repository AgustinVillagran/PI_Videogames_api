const { default: axios } = require("axios");
const { Op } = require("sequelize");
const { Videogame, Genre } = require("../db");
const { DB_API_KEY } = process.env;

const ID_UNDEFINED = "Ups! This ID doesn't exist :).."
const NAME_NOT_AVAILABLE = "Name is not available, sorry :)."
const GENRE_UNDEF = ["Genres are not availables, sorry :)"];
const URL_IMAGE_NOT_AVAILABLE = "https://www.feednavigator.com/var/wrbm_gb_food_pharma/storage/images/_aliases/news_large/9/2/8/5/235829-6-eng-GB/Feed-Test-SIC-Feed-20142.jpg";
const VG_NOT_FOUND =
["We dont find the game you are looking for,check the name and try again :)."];
const RATING_UNDEFINED = "0";
const PLATFORMS_UNDEFINED = [];

module.exports = {
  async getApiVideogames() {
    try {
      let gamesAPI= [];
      let gamesAPIMerged;
      let URL_GAMES = `https://api.rawg.io/api/games?key=${DB_API_KEY}&page=`;
      let i = 1;

      while(i<6){
        gamesAPI.push(axios(`${URL_GAMES}${i}`));
        i++;
      };

      gamesAPI = (await Promise.all(gamesAPI)).map((el) => { // [x5[x20{}]]
        return el.data.results.map((la) => ({
          id: la.id
            ? la.id
            :ID_UNDEFINED,
          name: la.name
            ?la.name
            : NAME_NOT_AVAILABLE,
          genres: la.genres.length
            ? la.genres.map((le) => {
                return le.name;
              })
            : GENRE_UNDEF,
          background_image: la.background_image
            ? la.background_image
            :URL_IMAGE_NOT_AVAILABLE,
          rating: la.rating
            ? la.rating
            : RATING_UNDEFINED,
          platforms:  la.platforms?.length
            ? la.platforms.map(el => el.platform.name)
            : PLATFORMS_UNDEFINED,
        }));
      });
      
      gamesAPIMerged = [];
      gamesAPI.map((la) => {
        gamesAPIMerged = gamesAPIMerged.concat(la);
      });

      return gamesAPIMerged;
    } catch (err) {
      throw err;
    }
  },
  async getDDBBVideogames() {
    try {
      let gamesDDBB = (
        await Videogame.findAll({
          attributes: ["id", "name", "background_image", "rating", "platforms"],
          include: {
            model: Genre,
            attributes: ["name"],
            through: {
              attributes: [],
            },
          },
        })
      ).map((la) => la.toJSON());

      gamesDDBB = gamesDDBB.map((el) => ({
        id: el.id,
        name: el.name,
        background_image: el.background_image
          ? el.background_image
          : URL_IMAGE_NOT_AVAILABLE,
        genres: el.genres?.length
        ? el.genres.map((le) => le.name)
        : GENRE_UNDEF,
        rating: el.rating
          ? el.rating
          : RATING_UNDEFINED,
        platforms:  el.platforms
          ? el.platforms
          : PLATFORMS_UNDEFINED,
      }));

      return gamesDDBB;
    } catch (err) {
      throw err;
    }
  },
  async getAllVideogames() {
    try {
      const gamesAPIMerged = await module.exports.getApiVideogames();
      const gamesDDBB = await module.exports.getDDBBVideogames();
      const gamesMerged = gamesAPIMerged.concat(gamesDDBB);

      return gamesMerged;
    } catch (err) {
      throw err;
    }
  },
  async findDDBBVideogame(name) {
    try {
      let gamesFoundedDDBB = (
        await Videogame.findAll({
          where: {
            name: {
              [Op.substring]: name,
              // [Op.like] : `%${name}%`,
            },
          },
          attributes: ["id","name", "background_image", "rating"],
          include: {
            model: Genre,
            attributes: ["name"],
            through: {
              attributes: [],
            },
          },
        })
      ).map((la) => la.toJSON());

      return gamesFoundedDDBB;
    } catch (err) {
      throw err;
    }
  },
  async findApiVideogame(name) {
    const URL_GAME_NAME = `https://api.rawg.io/api/games?search=${name}&&key=${DB_API_KEY}`;

    try {
      const gamesFoundedDDBB = await module.exports.findDDBBVideogame(name);

      if (gamesFoundedDDBB.length < 15) {
        const i = 15 - Number(gamesFoundedDDBB.length);

        let gamesFoundedAPI = (
          await axios({
            method: "GET",
            url: URL_GAME_NAME,
            transformResponse: (data) => {
              data = JSON.parse(data);
              return data.results.map((el) => {
                return {
                  id: el.id
                    ? el.id
                    : ID_UNDEFINED,
                  name: el.name
                    ? el.name
                    : NAME_NOT_AVAILABLE,
                  background_image: el.background_image
                    ? el.background_image
                    :URL_IMAGE_NOT_AVAILABLE,
                  genres: el.genres.length
                    ? el.genres.map((le) => {
                        return le.name;
                      })
                    : GENRE_UNDEF,
                    rating: el.rating
                      ? el.rating
                      : RATING_UNDEFINED,
                };
              });
            },
          })
        ).data;

        return gamesFoundedAPI.slice(0, i);
      }
    } catch (err) {
      throw err;
    }
  },
  async findVideogame(name) {
    try {
      let gamesFoundedDDBB = await module.exports.findDDBBVideogame(name);
      let gamesFoundedAPI = await module.exports.findApiVideogame(name);
      let gamesFoundedMerge = gamesFoundedDDBB.concat(gamesFoundedAPI);

      return gamesFoundedMerge.length === 0 ? VG_NOT_FOUND : gamesFoundedMerge;
    } catch (err) {
      throw err;
    }
  },
};
