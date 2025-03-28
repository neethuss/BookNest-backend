"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch_1 = require("@elastic/elasticsearch");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const elasticClient = new elasticsearch_1.Client({
    cloud: {
        id: process.env.ELASTICSEARCH_CLOUD_ID || "your_default_cloud_id"
    },
    auth: {
        username: process.env.ELASTIC_USERNAME || "elastic",
        password: process.env.ELASTIC_PASSWORD || "default_password"
    }
});
exports.default = elasticClient;
