//user controller
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create and Save a new User
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.username || !req.body.password) {
        res.status(400).send({
            message: 'Content can not be empty!'
        });
        return;
    }

    // Create a User
    const user = {
        username: req.body.username,
        password: req.body.password,
        role_id: req.body.role_id
    };

    try {
        // Save User in the database
        const createdUser = await prisma.user.create({
            data: user
        });
        res.redirect('/users');
    } catch (err) {
        res.status(500).send({
            message:
                err.message || 'Some error occurred while creating the User.'
        });
    }
};

// Retrieve all Users from the database.
exports.findAll = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.render('users', { title: 'Users', users });
    } catch (err) {
        res.status(500).send({
            message:
                err.message || 'Some error occurred while retrieving users.'
        });
    }
};

// Find a single User with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) }
        });
        res.render('user', { title: 'User', user });
    } catch (err) {
        res.status(500).send({
            message: 'Error retrieving User with id=' + id
        });
    }
};

// Update a User by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        if (updatedUser) {
            res.redirect('/users');
        } else {
            res.send({
                message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: 'Error updating User with id=' + id
        });
    }
};

// Delete a User with the specified id in the request
exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const deletedUser = await prisma.user.delete({
            where: { id: parseInt(id) }
        });
        if (deletedUser) {
            res.redirect('/users');
        } else {
            res.send({
                message: `Cannot delete User with id=${id}. Maybe User was not found!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: 'Could not delete User with id=' + id
        });
    }
};
