"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feature = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../connection/database"));
class Feature extends sequelize_1.Model {
}
exports.Feature = Feature;
Feature.init({
    // Model attributes are defined here
    feature: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    // Other model options go here
    sequelize: database_1.default,
    modelName: 'Feature'
});
