"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch_1 = require("@elastic/elasticsearch");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
const elasticClient = new elasticsearch_1.Client({
    node: process.env.ELASTICSEARCH_NODE || "http://localhost:9200",
    maxRetries: 5,
    requestTimeout: 60000,
    sniffOnStart: false,
    auth: {
        username: 'elastic', // Default username for Elasticsearch
        password: process.env.ELASTIC_PASSWORD || 'default_password' // Password from .env file
    }
});
exports.default = elasticClient;
