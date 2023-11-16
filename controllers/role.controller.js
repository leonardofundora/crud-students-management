//role controller
const Role = require('../models/role.model.js');

// Create and Save a new Role
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name || !req.body.description) {
        res.status(400).send({
            message: 'Content can not be empty!'
        });
        return;
    }

    // Create a Role
    const role = {
        name: req.body.name,
        description: req.body.description
    };

    // Save Role in the database
    Role.create(role)
        .then(data => {
            res.redirect('/roles');
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while creating the Role.'
            });
        });
};

// Retrieve all Roles from the database.
exports.findAll = (req, res) => {
    Role.findAll()
        .then(data => {
            res.render('roles', { title: 'Roles', roles: data });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while retrieving roles.'
            });
        });
};

// Find a single Role with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Role.findByPk(id)
        .then(data => {
            res.render('role', { title: 'Role', role: data });
        })
        .catch(err => {
            res.status(500).send({
                message: 'Error retrieving Role with id=' + id
            });
        });
};

// Update a Role by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Role.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.redirect('/roles');
            } else {
                res.send({
                    message: `Cannot update Role with id=${id}. Maybe Role was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: 'Error updating Role with id=' + id
            });
        });
};

// Delete a Role with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Role.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.redirect('/roles');
            } else {
                res.send({
                    message: `Cannot delete Role with id=${id}. Maybe Role was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: 'Could not delete Role with id=' + id
            });
        });
};

