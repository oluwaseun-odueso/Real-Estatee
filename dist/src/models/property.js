"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Property = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../connection/database"));
class Property extends sequelize_1.Model {
}
exports.Property = Property;
Property.init({
    // Model attributes are defined here
    seller_id: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false
    },
    address_id: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
    },
    price: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    payment_status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
}, {
    // Other model options go here
    sequelize: database_1.default,
    modelName: 'Property'
});
