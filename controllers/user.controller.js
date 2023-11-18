//user controller
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

// Definimos una función auxiliar para generar un token a partir de un usuario
// Esta función recibe un objeto user y devuelve un token generado con la librería jsonwebtoken
const generateToken = (user) => {
    // Extraemos el id y el email del usuario
    const { id, email } = user;
    // Creamos un objeto payload con el id y el email del usuario
    const payload = { id, email };
    // Generamos un token usando la función jwt.sign, pasándole el payload, el secreto y algunas opciones
    // El secreto debe ser el mismo que se usó para verificar el token
    // Las opciones pueden incluir la fecha de expiración, el algoritmo de firma, etc.
    // En este caso, indicamos que el token caduca en una hora
    const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
        expiresIn: "48h",
    });
    // Devolvemos el token
    return token;
};

// Definimos una función para registrar un nuevo usuario
// Esta función recibe un nombre, un email y una contraseña y crea un nuevo usuario en la base de datos
// Esta función se usa como controlador de la ruta /auth/register
const registerUser = async (req, res) => {
    try {
        // Extraemos el nombre, el email y la contraseña del cuerpo de la petición
        const { name, email, password, id, roleId } = req.body;
        // Comprobamos si los datos entrantes están vacíos
        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: "Por favor, introduce los datos" });
        }
        // Comprobamos si el usuario ya existe o no
        const userExist = await prisma.user.findUnique({ where: { email } });
        if (userExist) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }
        // Encriptamos la contraseña usando la función bcrypt.hash, pasándole la contraseña y un número de rondas de salting
        // El salting es un proceso que añade aleatoriedad a la contraseña para hacerla más segura
        const hashedPassword = await bcrypt.hash(password, 10);
        // Creamos el nuevo usuario usando el cliente de prisma, pasándole el nombre, el email y la contraseña encriptada
        const newUser = await prisma.user.create({
            data: { id, name, email, password: hashedPassword, roleId },
        });
        // Generamos un token para el nuevo usuario usando la función auxiliar que definimos antes
        const token = generateToken(newUser);
        // Devolvemos una respuesta exitosa con el token y el usuario
        return res.status(201).json({ token, user: newUser });
    } catch (error) {
        // Si ocurre algún error, lo devolvemos
        return res.status(500).json({ message: error.message });
    }
};

// Definimos una función para iniciar sesión con un usuario existente
// Esta función recibe un email y una contraseña y verifica si el usuario es válido y si la contraseña es correcta
// Esta función se usa como controlador de la ruta /auth/login
const loginUser = (req, res) => {
    try {
        // Extraemos el usuario de la petición
        // Este usuario es el que nos devuelve el middleware de passport con la estrategia local
        const user = req.user;
        // Generamos un token para el usuario usando la función auxiliar que definimos antes
        const token = generateToken(user);
        // Devolvemos una respuesta exitosa con el token y el usuario
        return res.status(200).json({ token, user });
    } catch (error) {
        // Si ocurre algún error, lo devolvemos
        return res.status(500).json({ message: error.message });
    }
};

// Definimos una función para cerrar sesión
// Esta función no recibe ningún parámetro
// Esta función se usa como controlador de la ruta /auth/logout
const logoutUser = (req, res, next) => {
    try {
        // Usamos el método req.logout para cerrar la sesión del usuario
        req.logout((err) => {
            // If there is an error, handle it
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            // If there is no error, redirect the user to the home page
            res.redirect("/auth/login");
        });
    } catch (error) {
        // Si ocurre algún error, lo devolvemos
        return res.status(500).json({ message: error.message });
    }
};

// Definimos una función para obtener el perfil de un usuario autenticado
// Esta función recibe un token en la cabecera de la petición y verifica si el token es válido y si el usuario existe
// Esta función se usa como controlador de la ruta /auth/profile
const getProfile = (req, res) => {
    try {
        // Extraemos el usuario de la petición
        // Este usuario es el que nos devuelve el middleware de passport con la estrategia basada en JWT
        const user = req.user;
        // Devolvemos una respuesta exitosa con el usuario
        return res.status(200).json({ user });
    } catch (error) {
        // Si ocurre algún error, lo devolvemos
        return res.status(500).json({ message: error.message });
    }
};

//otras operaciones crud
// Definimos una función para obtener todos los usuarios
// Esta función se usa como controlador de la ruta /users
const getUsers = async (req, res, next) => {
    try {
        // Buscamos todos los usuarios usando el cliente de prisma
        const users = await prisma.user.findMany();
        // Devolvemos una respuesta exitosa con los usuarios
        res.locals.users = users;
        return next();
    } catch (error) {
        // Si ocurre algún error, lo devolvemos
        res.locals.error = error;
        return next();
    }
};

// Definimos una función para obtener un usuario por su id
// Esta función se usa como controlador de la ruta /users/:id
const getUserById = async (req, res) => {
    try {
        // Extraemos el id de los parámetros de la petición
        const { id } = req.params;
        // Buscamos el usuario por su id usando el cliente de prisma
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
        });
        // Si el usuario no existe, devolvemos un error
        if (!user) {
            return res.status(404).json({ message: "El usuario no existe" });
        }
        // Si el usuario existe, lo devolvemos
        return res.status(200).json({ user });
    } catch (error) {
        // Si ocurre algún error, lo devolvemos
        return res.status(500).json({ message: error.message });
    }
};

// Definimos una función para actualizar un usuario
// Esta función recibe un nombre, un email y una contraseña y crea un nuevo usuario en la base de datos
// Esta función se usa como controlador de la ruta /users
const updateUser = async (req, res) => {
    try {
        // Extraemos el id de los parámetros de la petición
        const { id } = req.params;
        // Extraemos el nombre, el email y la contraseña del cuerpo de la petición
        const { name, email, password } = req.body;
        // Comprobamos si los datos entrantes están vacíos
        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: "Por favor, introduce los datos" });
        }
        // Encriptamos la contraseña usando la función bcrypt.hash, pasándole la contraseña y un número de rondas de salting
        // El salting es un proceso que añade aleatoriedad a la contraseña para hacerla más segura
        const hashedPassword = await bcrypt.hash(password, 10);
        // Actualizamos el usuario usando el cliente de prisma, pasándole el id, el nombre, el email y la contraseña encriptada
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { name, email, password: hashedPassword },
        });
        // Devolvemos una respuesta exitosa con el usuario actualizado
        return res.status(200).json({ updatedUser });
    } catch (error) {
        // Si ocurre algún error, lo devolvemos
        return res.status(500).json({ message: error.message });
    }
};

// Definimos una función para eliminar un usuario
// Esta función se usa como controlador de la ruta /users/:id
const deleteUser = async (req, res) => {
    try {
        // Extraemos el id de los parámetros de la petición
        const { id } = req.params;
        // Eliminamos el usuario usando el cliente de prisma
        const deletedUser = await prisma.user.delete({
            where: { id: parseInt(id) },
        });
        // Devolvemos una respuesta exitosa con el usuario eliminado
        return res.status(200).json({ deletedUser });
    } catch (error) {
        // Si ocurre algún error, lo devolvemos
        return res.status(500).json({ message: error.message });
    }
};

// Exportamos las funciones que definimos
module.exports = {
    logoutUser,
    registerUser,
    loginUser,
    getProfile,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};
