const { Router } = require("express");
const { GET_GENRES } = require("../Controllers/Genres");

const router = Router();

module.exports={

routGenres: router.get(`/`, GET_GENRES),

};