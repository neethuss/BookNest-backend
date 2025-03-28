"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const dbConfig_1 = __importDefault(require("./config/dbConfig"));
const BookRoute_1 = __importDefault(require("./routes/BookRoute"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
(0, dbConfig_1.default)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3003;
app.use((0, cors_1.default)({
    origin: [
        'https://book-nest-frontend-puce.vercel.app',
        'https://book-nest-frontend-h7vfquysz-neethuss-projects.vercel.app',
        'http://localhost:3000'
    ],
    credentials: true,
    methods: 'GET, POST, PUT, PATCH, DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
// Routes
app.use('/', BookRoute_1.default);
// Default Route
app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});
// ✅ Global Error Handling (Ensures CORS Headers on Errors)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
});
// Start Server
app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
});
