"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const seller_1 = __importDefault(require("./routes/seller"));
const property_1 = __importDefault(require("./routes/property"));
const buyer_1 = __importDefault(require("./routes/buyer"));
const controller_1 = __importDefault(require("./images/controller"));
const cors_1 = __importDefault(require("cors"));
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'https://real-estate-collab.vercel.app/'],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));
app.use('/seller', seller_1.default);
app.use('/property', property_1.default);
app.use('/buyer', buyer_1.default);
app.use('/image', controller_1.default);
app.get('/', (req, res) => {
    res.status(200).send({ success: true, message: " Official Real Estate Page" });
});
app.get('/logout', (req, res) => {
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// mail("backendseun@gmail.com")
//   .then((res) => {
//     console.log("email sent")
//     console.log(res);
//   })
//   .catch((err) => console.log(err));
module.exports = app;
