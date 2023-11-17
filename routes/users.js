const express = require("express");
const router = express.Router();
const passport = require("passport");
const { getUsers } = require("./../controllers/user.controller");

/* GET users listing. */
//usar el middleware de passport con la estrategia basada en JWT que definimos en el archivo passport.js
//usar la función getUsers del controlador user para manejar la lógica de esta ruta
//renderizar la vista users/ con los usuarios que nos devuelve la base de datos
router.get("/", passport.authenticate("jwt"), getUsers);

module.exports = router;
