import { Model, DataTypes, Sequelize } from 'sequelize';

class Process extends Model {
    public id!: number;
    public parent_process_id!: number | null;
    public name!: string;
    public description!: string | null;
    public area_id!: number | null;
    public related_tools!: string | null;
    public related_users!: string | null;
    public status!: string;
    public priority!: string;

    static associate(models: any) {
        Process.belongsTo(models.Process, {
            as: 'parentProcess',
            foreignKey: 'parent_process_id',
            onDelete: 'CASCADE',
        });
        Process.hasMany(models.Process, {
            as: 'subProcesses',
            foreignKey: 'parent_process_id',
        });
        Process.belongsTo(models.Area, {
            foreignKey: 'area_id',
            onDelete: 'SET NULL',
        });
    }
}

const processInit = (sequelize: Sequelize) => {
    Process.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            parent_process_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'Processes',
                    key: 'id',
                },
            },
            area_id: {
                type: DataTypes.INTEGER,
                allowNull: true, // changed to true
                references: {
                    model: 'Areas',
                    key: 'id',
                },
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            related_tools: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            related_users: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            priority: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Process',
        }
    );
    return Process;
};

export default processInit;
