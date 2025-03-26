import { Sequelize } from 'sequelize';
import processInit from '../models/process';
import areaInit from '../models/area';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: false,
});

const db = {
    sequelize,
    Process: processInit(sequelize),
    Area: areaInit(sequelize),
};

// Add associations here, after initializing both models
db.Area.hasMany(db.Process, { foreignKey: 'area_id', onDelete: 'SET NULL' });
db.Process.belongsTo(db.Area, { foreignKey: 'area_id', onDelete: 'SET NULL' });

// Add process self-association.
db.Process.belongsTo(db.Process, { as: 'parentProcess', foreignKey: 'parent_process_id', onDelete: 'CASCADE' });
db.Process.hasMany(db.Process, { as: 'subProcesses', foreignKey: 'parent_process_id' });

export default db;
