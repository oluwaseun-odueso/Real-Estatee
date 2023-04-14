"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const seller_1 = __importDefault(require("./routes/seller"));
const property_1 = __importDefault(require("./routes/property"));
const buyer_1 = __importDefault(require("./routes/buyer"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_1 = __importDefault(require("multer"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'https://real-estate-collab.vercel.app/'],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));
// Set up multer to handle file uploads
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type.'));
        }
    },
});
// Set up an Amazon S3 client
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
app.post('/upload', upload.single('image'), async (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(400).json({ error: 'No image uploaded.' });
        return;
    }
    try {
        // Save the image to S3
        const filename = `${Date.now()}-${file.originalname}`;
        const fileStream = file.buffer;
        const contentType = file.mimetype;
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filename,
            Body: fileStream,
            ContentType: contentType,
        };
        const result = await s3.upload(uploadParams).promise();
        res.json({ url: result.Location });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to upload image.' });
    }
});
app.use('/seller', seller_1.default);
app.use('/property', property_1.default);
app.use('/buyer', buyer_1.default);
app.get('/', (req, res) => {
    res.status(200).send({ success: true, message: " Official Real Estate Page" });
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;
