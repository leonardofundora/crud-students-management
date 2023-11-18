const express = require("express");
const router = express.Router();
const { getUsers, registerUser } = require("./../controllers/user.controller");
const { ensureAuthenticated } = require("./../utils/auth");

/* GET users listing. */
//usar el middleware de passport con la estrategia basada en JWT que definimos en el archivo passport.js
//usar la función getUsers del controlador user para manejar la lógica de esta ruta
//renderizar la vista users/ con los usuarios que nos devuelve el controlador
router.get(
    "/",
    ensureAuthenticated,
    getUsers,
    (req, res) => {
        res.render("users/users", { users: res.locals.users, user: req.user });
    },
);

router.get("/add", ensureAuthenticated,(req, res) => {
    res.render("users/add-user", { user: req.user });
});

router.post("/add", ensureAuthenticated, registerUser, (req, res) => {
    res.redirect("/users");
});

/* Register POST */
// Definimos una ruta para registrar un nuevo usuario
// Esta ruta recibe un nombre, un email y una contraseña y crea un nuevo usuario en la base de datos
// Usamos la función registerUser del controlador user para manejar la lógica de esta ruta
router.post("/register", registerUser);

module.exports = router;
