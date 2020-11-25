module.exports = (sequelize, type) => {
    return sequelize.define('Shift_types', {
        id: {
            field: 'id_s_type',
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: type.STRING,
            allowNull: false
        }
    }, { timestamps: false })
}