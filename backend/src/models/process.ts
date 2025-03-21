// /backend/src/models/process.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

class Process extends Model {
  public id!: number;
  public parent_process_id!: number | null;
  public name!: string;
  public description!: string | null;
  public area_id!: number | null;

  static associate(models: any) {
    Process.belongsTo(models.Process, {
      as: 'parentProcess',
      foreignKey: 'parent_process_id',
      onDelete: 'CASCADE',
    });
    Process.hasMany(models.Process, { as: 'subProcesses', foreignKey: 'parent_process_id' });
    Process.belongsTo(models.Area, { foreignKey: 'area_id', onDelete: 'SET NULL' });

  }
}
const processInit = (sequelize: Sequelize) => {
    Process.init({
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        parent_process_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
              model: 'Processes', // must match the modelName, case-sensitive
              key: 'id'
          }
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        area_id: {
            type: DataTypes.INTEGER,
            allowNull: true, // TODO: possibly remove this? I am not sure if I will really need it from how everything is structured
            references: {
                model: 'Areas',
                key: 'id',
            }
        }
      }, {
        sequelize,
        modelName: 'Process',
      });
    return Process;
}

export default processInit;
