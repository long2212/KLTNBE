module.exports = (sequelize, type) => {
    return sequelize.define('Doctors', {
        id: {
            field: 'id_doc',
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_Spec: {
            type: type.INTEGER,
            allowNull: false
        },
        name: {
            type: type.STRING,
            allowNull: false
        },
    }, { timestamps: false })
}