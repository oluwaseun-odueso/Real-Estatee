import {DataTypes, Model} from 'sequelize';
import sequelize from '../connection/database';

export class Property extends Model {}

Property.init({
    // Model attributes are defined here
    seller_id: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    address_id: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Property' 
  });