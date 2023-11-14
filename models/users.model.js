//users model sequilize
const Roles = require("./roles.model");

module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("users", {
        id: {
            type: DataTypes.STRING,
            max: 11,
            primaryKey: true,
        },
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    });

    Users.belongsTo(Roles, {
        foreignKey: "role_id",
        as: "role",
    });

    return Users;
};
