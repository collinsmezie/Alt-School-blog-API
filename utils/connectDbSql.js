const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/sqlDbConfig');
const BookModel = require('../models/sqlBookModel');


const sequelize = new Sequelize(
    config.DB_NAME,
    config.DB_USER,
    config.DB_PASSWORD, {
    host: config.DB_HOST,
    dialect: config.DB_DIALECT
});


sequelize.authenticate()
    .then(() => console.log('Connected to MySQL DB successfully'))
    .catch(err => console.log('Unable to connect to database', err));


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.books = BookModel(sequelize, DataTypes);

db.sequelize.sync({ force: false })
    .then(() => {
        console.log('Database & tables sync successfully!');
    }).catch(err => {
        console.log('Error occurred while syncing the database', err);
    });

module.exports = { db };
