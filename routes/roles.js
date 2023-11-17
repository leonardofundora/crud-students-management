//roles router
const { Router } = require("express");
const router = Router();
const passport = require("passport");
const { createRole, deleteRole, getRoleById, getRoles, updateRole } = require("./../controllers/role.controller");

// Definimos una ruta para obtener todos los roles
// Esta ruta no recibe ningún parámetro
// Usamos el middleware de passport con la estrategia basada en JWT que definimos en el archivo passport.js
// Usamos la función getRoles del controlador role para manejar la lógica de esta ruta
// Devolvemos una respuesta exitosa con los roles que nos devuelve el controlador
router.get("/", passport.authenticate("jwt", { session: false }), getRoles, (req, res) => {
    res.render("roles/", { roles: res.locals.roles });
});

// Definimos una ruta para obtener un rol por su id
// Esta ruta recibe un id como parámetro de la ruta
// Usamos el middleware de passport con la estrategia basada en JWT que definimos en el archivo passport.js
// Usamos la función getRoleById del controlador role para manejar la lógica de esta ruta
// Devolvemos una respuesta exitosa con el rol que nos devuelve el controlador
router.get("/:id", passport.authenticate("jwt", { session: false }), getRoleById, (req, res) => {
    res.render("roles/", { roles: res.locals.roles });
});

// Definimos una ruta para crear un nuevo rol
// Esta ruta recibe un nombre en el cuerpo de la petición
// Usamos el middleware de passport con la estrategia basada en JWT que definimos en el archivo passport.js
// Usamos la función createRole del controlador role para manejar la lógica de esta ruta
// Devolvemos una respuesta exitosa con el rol que nos devuelve el controlador
router.post("/", createRole, (req, res) => {
    res.render("roles/", { roles: res.locals.roles });
});

// Definimos una ruta para actualizar un rol
// Esta ruta recibe un id como parámetro de la ruta y un nombre en el cuerpo de la petición
// Usamos el middleware de passport con la estrategia basada en JWT que definimos en el archivo passport.js
// Usamos la función updateRole del controlador role para manejar la lógica de esta ruta
// Devolvemos una respuesta exitosa con el rol que nos devuelve el controlador
router.patch("/:id", passport.authenticate("jwt", { session: false }), updateRole, (req, res) => {
    res.render("roles/", { roles: res.locals.roles });
});


// Definimos una ruta para eliminar un rol
// Esta ruta recibe un id como parámetro de la ruta
// Usamos el middleware de passport con la estrategia basada en JWT que definimos en el archivo passport.js
// Usamos la función deleteRole del controlador role para manejar la lógica de esta ruta
// Devolvemos una respuesta exitosa con el rol que nos devuelve el controlador
router.delete("/:id", passport.authenticate("jwt", { session: false }), deleteRole, (req, res) => {
    res.render("roles/", { roles: res.locals.roles });
});


module.exports = router;