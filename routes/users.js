var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res) {
    //render users con el body y el navbar
    res.render("users/users", {
        headersTab:['Nombre','Correo','Acciones'],
        users: [
            {
                name: "Juan",
                lastName: "Perez",
                email: "juan@juan.com"
            },
        ],
    });
});

module.exports = router;
