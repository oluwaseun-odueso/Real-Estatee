import {DataTypes, Model} from 'sequelize';
import sequelize from '../connection/database';

export class Address extends Model {}

Address.init({
    // Model attributes are defined here
    street: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
    },
    postal_code : {
      type: DataTypes.NUMBER
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Address' 
  });