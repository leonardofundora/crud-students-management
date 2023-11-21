// Importamos las dependencias que vamos a usar
const express = require("express");
const passport = require("passport");

// Creamos un objeto router de express
const router = express.Router();

// Importamos las funciones de los controladores que definimos en la carpeta controllers
const {
    registerUser,
    getProfile,
    logoutUser,
} = require("./../controllers/user.controller");
const { ensureAuthenticated } = require("../utils/auth");

// Definimos una ruta para registrar un nuevo usuario
// Esta ruta recibe un nombre, un email y una contraseña y crea un nuevo usuario en la base de datos
// Usamos la función registerUser del controlador user para manejar la lógica de esta ruta
router.post("/register", registerUser);

// Definimos una ruta para iniciar sesión con un usuario existente
// Esta ruta recibe un email y una contraseña y verifica si el usuario es válido y si la contraseña es correcta
// Usamos el middleware de passport con la estrategia local que definimos en el archivo passport.js
// Usamos la función loginUser del controlador user para manejar la lógica de esta ruta
router.get("/login", (req, res) => {
    // Renderizar la vista de login usando el método res.render, pasándole el nombre del archivo sin la extensión
    res.render("login");
});

// Definimos una ruta para iniciar sesión con un usuario existente
// Esta ruta recibe un email y una contraseña y verifica si el usuario es válido y si la contraseña es correcta
// Usamos el loginUser del controlador user para manejar la lógica de esta ruta
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/auth/login",
        successRedirect: "/users",
    }),
);

// Definimos una ruta para cerrar sesión
// Esta ruta no recibe ningún parámetro
// Usamos el método req.logout para cerrar la sesión del usuario
// Redirigimos al usuario a la vista de login
router.get("/logout", logoutUser);


// Exportamos el objeto router
module.exports = router;
