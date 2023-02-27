import {DataTypes, Model} from 'sequelize';
import sequelize from '../connection/database';

export class PropertyFeatures extends Model {}

PropertyFeatures.init({
    // Model attributes are defined here
    property_id: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    feature_id: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    number: {
      type: DataTypes.NUMBER,
      allowNull: false
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'PropertyFeatures' 
  });