import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const elasticClient = new Client({
  node: process.env.ELASTICSEARCH_NODE || "http://localhost:9200",
  maxRetries: 5,
  requestTimeout: 60000,
  sniffOnStart: false,
  auth: {
    username: 'elastic', // Default username for Elasticsearch
    password: process.env.ELASTIC_PASSWORD || 'default_password' // Password from .env file
  }
});

export default elasticClient;
