import {DataTypes, Model} from 'sequelize';
import sequelize from '../connection/database';

export class Feature extends Model {}

Feature.init({
    // Model attributes are defined here
    feature: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Feature' 
  });