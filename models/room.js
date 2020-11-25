module.exports = (sequelize, type) => {
    return sequelize.define('Rooms', {
        id: {
            field: 'id_room',
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_spec: {
            type: type.INTEGER,
            allowNull: false
        },
        name: {
            type: type.STRING,
            allowNull: false
        }
    }, { timestamps: false })
}