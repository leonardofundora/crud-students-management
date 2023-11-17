// Importamos las dependencias que vamos a usar
const express = require('express');
const passport = require('passport');

// Creamos un objeto router de express
const router = express.Router();

// Importamos las funciones de los controladores que definimos en la carpeta controllers
const { registerUser, loginUser, getProfile } = require('../controllers/user');

// Definimos una ruta para registrar un nuevo usuario
// Esta ruta recibe un nombre, un email y una contraseña y crea un nuevo usuario en la base de datos
// Usamos la función registerUser del controlador user para manejar la lógica de esta ruta
router.post('/register', registerUser);

// Definimos una ruta para iniciar sesión con un usuario existente
// Esta ruta recibe un email y una contraseña y verifica si el usuario es válido y si la contraseña es correcta
// Usamos el middleware de passport con la estrategia local que definimos en el archivo passport.js
// Usamos la función loginUser del controlador user para manejar la lógica de esta ruta
router.post('/login', passport.authenticate('local'), loginUser);

// Definimos una ruta protegida que solo pueda acceder un usuario autenticado
// Esta ruta recibe un token en la cabecera de la petición y verifica si el token es válido y si el usuario existe
// Usamos el middleware de passport con la estrategia basada en JWT que definimos en el archivo passport.js
// Usamos la función getProfile del controlador user para manejar la lógica de esta ruta
router.get('/profile', passport.authenticate('jwt'), getProfile);

// Exportamos el objeto router
module.exports = router;
