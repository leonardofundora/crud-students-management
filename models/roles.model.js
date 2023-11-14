//define roles model sequilize
module.exports = (sequelize, DataTypes) => {
    const Roles = sequelize.define("roles", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    });
    return Roles;
};