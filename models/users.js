//users model sequilize
const { Model } = require("sequelize");

//associate roles also
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        static associate(models) {
            Users.belongsTo(models.Roles, {
                foreignKey: "role_id",
                as: "role",
            });
        }
    }
    Users.init(
        {
            id: {
                type: DataTypes.STRING,
                max: 11,
                primaryKey: true,
            },
            username: DataTypes.STRING,
            password: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "Users",
        },
    );
    return Users;
};
