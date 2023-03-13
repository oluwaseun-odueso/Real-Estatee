"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../connection/database"));
class Address extends sequelize_1.Model {
}
exports.Address = Address;
Address.init({
    // Model attributes are defined here
    street: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
    },
    country: {
        type: sequelize_1.DataTypes.STRING,
    },
    postal_code: {
        type: sequelize_1.DataTypes.NUMBER
    }
}, {
    // Other model options go here
    sequelize: database_1.default,
    modelName: 'Address'
});
