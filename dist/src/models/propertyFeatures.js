"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyFeatures = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../connection/database"));
class PropertyFeatures extends sequelize_1.Model {
}
exports.PropertyFeatures = PropertyFeatures;
PropertyFeatures.init({
    // Model attributes are defined here
    property_id: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false
    },
    feature_id: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false
    },
    number: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false
    }
}, {
    // Other model options go here
    sequelize: database_1.default,
    modelName: 'PropertyFeatures'
});
