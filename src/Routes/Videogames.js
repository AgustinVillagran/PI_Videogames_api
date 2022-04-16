const {Router} = require("express");
const {GET_ALL_VIDEOGAMES, GET_VIDEOGAMES_BY_NAME} = require("../Controllers/Videogames.js");

const router = Router();


router.get(`/`, GET_ALL_VIDEOGAMES);

router.get(`/`, GET_VIDEOGAMES_BY_NAME);

  module.exports= router;