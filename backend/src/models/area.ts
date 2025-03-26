// /backend/src/models/area.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

class Area extends Model {
	public id!: number;
	public name!: string;
}

const areaInit = (sequelize: Sequelize) => {
	Area.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
		},
		{
			sequelize,
			modelName: 'Area',
		},
	);
	return Area;
};

export default areaInit;
