//define roles model sequilize
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Roles extends Model {
        static associate(models) {
            // define association here
        }
    }
    Roles.init({
        name: DataTypes.STRING,
        description: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Roles',
    });
    return Roles;
};