const Sequelize = require('sequelize');

const DoctorShiftModel = require('./doctor_shift');
const DoctorModel = require('./doctor');

const UserModel = require('./user');
const ShiftModel = require('./shift');

const RoomModel = require('./room');
const ClinicHistoryModel = require('./clinic_history');

const SpecializedModel = require('./specialized');
const ShiftTypeModel = require('./shift_type');



const sequelize = new Sequelize('KLTN', 'khanhduc2020', 'Khanh_duc2020', {
    dialect: 'mssql',
    host: 'kltc2020.database.windows.net',
    dialectOptions: {
        options: {
            encrypt: true
        }
    },
    pool: { max: 20, min: 0, acquire: 30000, idle: 10000 },
    logging: true
});

const DoctorShift = DoctorShiftModel(sequelize, Sequelize)
const Doctor = DoctorModel(sequelize, Sequelize)

const User = UserModel(sequelize, Sequelize)
const Shift = ShiftModel(sequelize, Sequelize)

const Room = RoomModel(sequelize, Sequelize)
const ClinicHistory = ClinicHistoryModel(sequelize, Sequelize)

const Specialized = SpecializedModel(sequelize, Sequelize)
const ShiftType = ShiftTypeModel(sequelize, Sequelize)


// AuthorBook.belongsTo(Author, { foreignKey: 'authorId', as: 'author' });
// Author.hasMany(AuthorBook, { foreignKey: 'authorId', as: 'authorBooks' });

// sequelize.sync({ force: false}).then(() => {
//     console.log('Database & tables created!')
// });

module.exports = {
    ClinicHistory,
    Doctor,
    DoctorShift,
    Room,
    ShiftType,
    Shift,
    Specialized,
    User
}