module.exports = (sequelize, type) => {
    return sequelize.define('Users', {
        id: {
            field: 'id_user',
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        account: {
            type: type.STRING,
            allowNull: false
        },
        password: {
            type: type.STRING,
            allowNull: false
        },
        type: {
            type: type.INTEGER,
            allowNull: false
        }
    }, { timestamps: false })
}