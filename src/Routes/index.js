const { Router } = require("express");
const {routGenres} = require("./Genres");
const routerVgs = require("./Videogames");
const routerVg = require("./Videogame");

const router = Router();

//Routers

router.use(`/genres`, routGenres);

router.use(`/videogames`, routerVgs);

router.use(`/videogame`, routerVg);

module.exports = router;
