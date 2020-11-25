module.exports = (sequelize, type) => {
    return sequelize.define('Clinic_Historys', {
        id: {
            field: 'id_Cli_his',
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_doc_shift: {
            type: type.INTEGER,
            allowNull: false
        },
        id_user: {
            type: type.INTEGER,
            allowNull: false
        }
    }, { timestamps: false })
}