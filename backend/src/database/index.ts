// /backend/src/database/index.ts
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
    Area: areaInit(sequelize)
};

// Add associations here, after initializing both models
db.Area.hasMany(db.Process, { foreignKey: 'area_id', onDelete: 'SET NULL' }); //SET NULL is important to avoid errors when deleting areas.
db.Process.belongsTo(db.Area, { foreignKey: 'area_id', onDelete: 'SET NULL' });

export default db;
