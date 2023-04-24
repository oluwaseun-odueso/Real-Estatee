"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const seller_1 = __importDefault(require("./routes/seller"));
const property_1 = __importDefault(require("./routes/property"));
const buyer_1 = __importDefault(require("./routes/buyer"));
const transaction_1 = __importDefault(require("./routes/transaction"));
const passport_1 = __importDefault(require("passport"));
require('./util/passportConfig');
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://real-estate-collab.vercel.app/"],
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH", "OPTIONS"],
}));
app.use('/seller', seller_1.default);
app.use('/property', property_1.default);
app.use('/buyer', buyer_1.default);
app.use('/transaction', transaction_1.default);
app.get("/", (req, res) => {
    res
        .status(200)
        .send({ success: true, message: " Official Real Estate Page" });
});
app.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/success');
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;
