//role controller
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create and Save a new Role
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.name || !req.body.description) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }

    // Create a Role
    const role = {
        name: req.body.name,
        description: req.body.description,
    };

    try {
        // Save Role in the database
        const createdRole = await prisma.role.create({
            data: role,
        });
        res.redirect("/roles");
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the Role.",
        });
    }
};

// Retrieve all Roles from the database.
exports.findAll = async (req, res) => {
    try {
        const roles = await prisma.role.findMany();
        res.render("roles", { title: "Roles", roles });
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving roles.",
        });
    }
};

// Find a single Role with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    try {
        const role = await prisma.role.findUnique({
            where: { id: parseInt(id) },
        });
        res.render("role", { title: "Role", role });
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving Role with id=" + id,
        });
    }
};

// Update a Role by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;

    try {
        const updatedRole = await prisma.role.update({
            where: { id: parseInt(id) },
            data: req.body,
        });
        if (updatedRole) {
            res.redirect("/roles");
        } else {
            res.send({
                message: `Cannot update Role with id=${id}. Maybe Role was not found or req.body is empty!`,
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error updating Role with id=" + id,
        });
    }
};

// Delete a Role with the specified id in the request
exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const deletedRole = await prisma.role.delete({
            where: { id: parseInt(id) },
        });
        if (deletedRole) {
            res.redirect("/roles");
        } else {
            res.send({
                message: `Cannot delete Role with id=${id}. Maybe Role was not found!`,
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Could not delete Role with id=" + id,
        });
    }
};
