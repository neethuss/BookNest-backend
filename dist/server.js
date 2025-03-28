"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const dbConfig_1 = __importDefault(require("./config/dbConfig"));
const BookRoute_1 = __importDefault(require("./routes/BookRoute"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
//database connection
(0, dbConfig_1.default)();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)({
    origin: ["https://book-nest-frontend-puce.vercel.app","https://book-nest-frontend-h7vfquysz-neethuss-projects.vercel.app","http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
app.use('/', BookRoute_1.default);
//port connection
app.listen(port, () => {
    console.log(`Backend server connected at port ${port}`);
});
