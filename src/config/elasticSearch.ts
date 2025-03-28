import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";

dotenv.config();

const elasticClient = new Client({
  cloud: {
    id: process.env.ELASTICSEARCH_CLOUD_ID || "your_default_cloud_id"
  },
  auth: {
    username: process.env.ELASTIC_USERNAME || "elastic",
    password: process.env.ELASTIC_PASSWORD || "default_password"
  }
});


export default elasticClient;
