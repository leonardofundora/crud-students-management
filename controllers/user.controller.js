//user controller
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const renderViewUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.render("users/users", { users });
    } catch (error) {
        res.locals.error = "Hubo un error al obtener la lista de usuarios.";
        res.render("users/users");
    }
};

// Controller to render add user form
const renderAddUserForm = async (req, res) => {
    try {
        const roles = await prisma.role.findMany();
        res.render("users/add-user", { roles });
    } catch (error) {
        res.locals.error = "Hubo un error al cargar el formulario de agregar usuario.";
        renderAddUserForm(req, res);
    }
};

// Controller to render update user form
const renderUpdateUserForm = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({ where: { id } });
        const roles = await prisma.role.findMany();
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.render("users/update-user", { user, roles });
    } catch (error) {
        res.locals.error = "Hubo un error al cargar el formulario de actualizar usuario.";
        renderUpdateUserForm(req, res);
    }
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
            return (res.locals.error = "Por favor, introduce todos los datos necesarios.");
        }
        // Comprobamos si el usuario ya existe o no
        const userExist = await prisma.user.findUnique({ where: { email } });
        if (userExist) {
            return (res.locals.error = "El usuario ya existe, por favor intenta con un email diferente.");
        }
        // Encriptamos la contraseña usando la función bcrypt.hash, pasándole la contraseña y un número de rondas de salting
        // El salting es un proceso que añade aleatoriedad a la contraseña para hacerla más segura
        const hashedPassword = await bcrypt.hash(password, 10);
        // Creamos el nuevo usuario usando el cliente de prisma, pasándole el nombre, el email y la contraseña encriptada
        const newUser = await prisma.user.create({
            data: {
                id,
                name,
                email,
                password: hashedPassword,
                roleId: +roleId,
            },
        });
        // Devolvemos una respuesta exitosa con el usuario
        return res.status(201).json({ newUser });
    } catch (error) {
        // Si ocurre algún error, lo devolvemos
        return res.status(500).json({ message: "Hubo un error al registrar el usuario, por favor intenta de nuevo." });
    }
};

// Definimos una función para cerrar sesión
// Esta función no recibe ningún parámetro
// Esta función se usa como controlador de la ruta /auth/logout
const logoutUser = (req, res) => {
    try {
        // Usamos el método req.logout para cerrar la sesión del usuario
        req.logout((err) => {
            // If there is an error, handle it
            if (err) {
                return res.status(500).json({ message: "Hubo un error al cerrar la sesión, por favor intenta de nuevo." });
            }
            // If there is no error, redirect the user to the home page
            res.redirect("/auth/login");
        });
    } catch (error) {
        // Si ocurre algún error, lo devolvemos
        res.locals.error = "Hubo un error al cerrar la sesión, por favor intenta de nuevo.";
        res.redirect("/auth/login");
    }
};

// Controller to create a user
const createUser = async (req, res) => {
    try {
        const { id, name, email, password, roleId } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                id,
                name,
                email,
                password: hashedPassword,
                roleId: +roleId,
            },
        });
        res.redirect("/users");
    } catch (error) {
        res.locals.error = "Hubo un error al crear el usuario, por favor intenta de nuevo.";
        renderAddUserForm(req, res);
    }
};

// Controller to update a user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            renderUpdateUserForm(req, res);
        }
        const { name, email, password, roleId } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { id },
            data: { name, email, password: hashedPassword, roleId: +roleId },
        });
        res.redirect("/users");
    } catch (error) {
        res.locals.error = "Hubo un error al actualizar el usuario, por favor intenta de nuevo.";
        renderUpdateUserForm(req, res);
    }
};

// Controller to delete a user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id } });
        redirect("/users");
    } catch (error) {
        res.locals.error = "Hubo un error al eliminar el usuario, por favor intenta de nuevo.";
        redirect("/users");
    }
};

module.exports = {
    registerUser,
    logoutUser,
    createUser,
    updateUser,
    deleteUser,
    renderAddUserForm,
    renderUpdateUserForm,
    renderViewUsers,
};
