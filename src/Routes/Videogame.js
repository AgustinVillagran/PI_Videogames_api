const {Router} = require("express");
const {GET_VIDEOGAME_BY_ID, CREATE_VIDEOGAME} = require("../Controllers/Videogame");

const router = Router();

router.get(`/:idVideogame`, GET_VIDEOGAME_BY_ID);

router.post(`/`, CREATE_VIDEOGAME);

module.exports = router; 