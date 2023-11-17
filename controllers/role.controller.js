//role controller
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Definimos una función para obtener todos los roles
// Esta función se usa como controlador de la ruta /roles
const getRoles = async (req, res) => {
    try {
        // Buscamos todos los roles usando el cliente de prisma
        const roles = await prisma.role.findMany();
        // Devolvemos una respuesta exitosa con los roles
        return res.status(200).json({ roles });
    } catch (error) {
        // Si ocurre algún error, lo devolvemos
        return res.status(500).json({ message: error.message });
    }
};

// Definimos una función para obtener un rol por su id
// Esta función se usa como controlador de la ruta /roles/:id
const getRoleById = async (req, res) => {
    try {
        // Extraemos el id de los parámetros de la petición
        const { id } = req.params;
        // Buscamos el rol por su id usando el cliente de prisma
        const role = await prisma.role.findUnique({
            where: { id: parseInt(id) },
        });
        // Si el rol no existe, devolvemos un error
        if (!role) {
            return res.status(404).json({ message: "El rol no existe" });
        }
        // Si el rol existe, lo devolvemos
        return res.status(200).json({ role });
    } catch (error) {
        // Si ocurre algún error, lo devolvemos
        return res.status(500).json({ message: error.message });
    }
};

// Definimos una función para crear un nuevo rol
// Esta función recibe un nombre y crea un nuevo rol en la base de datos
// Esta función se usa como controlador de la ruta /roles
const createRole = async (req, res) => {
    try {
        // Extraemos el nombre del cuerpo de la petición
        const { name } = req.body;
        // Comprobamos si el nombre está vacío
        if (!name) {
            return res
                .status(400)
                .json({ message: "Por favor, introduce el nombre" });
        }
        // Creamos el rol usando el cliente de prisma
        const role = await prisma.role.create({
            data: { name },
        });
        // Devolvemos una respuesta exitosa con el rol que acabamos de crear
        return res.status(201).json({ role });
    } catch (error) {
        // Si ocurre algún error, lo devolvemos
        return res.status(500).json({ message: error.message });
    }
};

// Definimos una función para actualizar un rol
// Esta función recibe un nombre y actualiza el rol en la base de datos
// Esta función se usa como controlador de la ruta /roles/:id
const updateRole = async (req, res) => {
    try {
        // Extraemos el id de los parámetros de la petición
        const { id } = req.params;
        // Extraemos el nombre del cuerpo de la petición
        const { name } = req.body;
        // Comprobamos si el nombre está vacío
        if (!name) {
            return res
                .status(400)
                .json({ message: "Por favor, introduce el nombre" });
        }
        // Actualizamos el rol usando el cliente de prisma
        const role = await prisma.role.update({
            where: { id: parseInt(id) },
            data: { name },
        });
        // Devolvemos una respuesta exitosa con el rol que acabamos de actualizar
        return res.status(200).json({ role });
    } catch (error) {
        // Si ocurre algún error, lo devolvemos
        return res.status(500).json({ message: error.message });
    }
};

// Definimos una función para eliminar un rol
// Esta función se usa como controlador de la ruta /roles/:id
const deleteRole = async (req, res) => {
    try {
        // Extraemos el id de los parámetros de la petición
        const { id } = req.params;
        // Eliminamos el rol usando el cliente de prisma
        const role = await prisma.role.delete({
            where: { id: parseInt(id) },
        });
        // Devolvemos una respuesta exitosa con el rol que acabamos de eliminar
        return res.status(200).json({ role });
    } catch (error) {
        // Si ocurre algún error, lo devolvemos
        return res.status(500).json({ message: error.message });
    }
};

// Exportamos las funciones del controlador
module.exports = {
    createRole,
    deleteRole,
    getRoleById,
    getRoles,
    updateRole,
};
