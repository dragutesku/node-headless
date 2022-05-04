import "reflect-metadata";
import { DataSource } from "typeorm";
// redis@v4
const redis = require('redis');

import { Post } from "./entity/Post";
import { User } from "./entity/User";

require('dotenv').config();

export const RedisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  legacyMode: true
});


export const Database = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username:  process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: true,
    logging: false,
    entities: [User, Post],
    migrations: [],
    subscribers: [],
});
