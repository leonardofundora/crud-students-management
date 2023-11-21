const express = require("express");
const router = express.Router();
const {
    createUser,
    updateUser,
    deleteUser,
    renderAddUserForm,
    renderUpdateUserForm,
    renderViewUsers,
} = require("./../controllers/user.controller");
const { ensureAuthenticated } = require("./../utils/auth");

router.get("/add-user", ensureAuthenticated, renderAddUserForm);

router.post("/add-user", ensureAuthenticated, createUser);

router.get("/update-user/:id", ensureAuthenticated, renderUpdateUserForm);

router.post("/update-user/:id", ensureAuthenticated, updateUser);

router.get("/delete-user/:id", ensureAuthenticated, deleteUser);

router.get("/", ensureAuthenticated, renderViewUsers);

module.exports = router;
