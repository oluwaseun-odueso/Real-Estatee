"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const seller_1 = __importDefault(require("./routes/seller"));
const property_1 = __importDefault(require("./routes/property"));
const controller_1 = __importDefault(require("./images/controller"));
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/seller', seller_1.default);
app.use('/property', property_1.default);
app.use('/image', controller_1.default);
app.get('/', (req, res) => {
    res.status(200).send({ success: true, message: " Official Real Estate Page" });
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;
