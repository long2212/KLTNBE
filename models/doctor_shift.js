module.exports = (sequelize, type) => {
    return sequelize.define('Doctor_Shift', {
        id: {
            field: 'id_doc_shift',
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_doc: {
            type: type.INTEGER,
            allowNull: false
        },
        id_shift: {
            type: type.INTEGER,
            allowNull: false
        },
        id_s_type: {
            type: type.INTEGER,
            allowNull: false
        },
        id_room: {
            type: type.INTEGER,
            allowNull: false
        },
        date: {
            type: type.DATE,
            allowNull: false
        }
    }, { timestamps: false })
}