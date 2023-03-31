import {DataTypes, Model} from 'sequelize';
import sequelize from '../connection/database';

export class PropertyImages extends Model {}

PropertyImages.init({
    // Model attributes are defined here
    property_id: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    image_key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'PropertyImages' 
  });