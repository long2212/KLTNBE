module.exports = (sequelize, type) => {
    return sequelize.define('Specializeds', {
        id: {
            field: 'id_spec',
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: type.STRING,
            allowNull: false
        },
        regional: {
            type: type.STRING,
            allowNull: false
        }
    }, { timestamps: false })
}