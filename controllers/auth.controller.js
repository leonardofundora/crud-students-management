const { LoginServices } = require('../services/login.services')

class LoginController {
    static async login (req, res) {
        const { body } = req

        const data = await LoginServices.login(body)
        console.log(data);

        if(data.length === 0) return res.render('/error')

        res.render("users/users")
    }
}

module.exports = { LoginController }
