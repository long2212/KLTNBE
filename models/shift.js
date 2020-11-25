module.exports = (sequelize, type) => {
    return sequelize.define('Shifts', {
        id: {
            field: 'id_shift',
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        shift: {
            type: type.STRING,
            allowNull: false
        },
    }, { timestamps: false })
}