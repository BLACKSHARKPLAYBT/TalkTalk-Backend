const db = require('mysql');
const {auth} = require("mysql/lib/protocol/Auth");
require('dotenv').config();
const host = process.env.sql_host;
const user = process.env.sql_user;
const password = process.env.sql_password;
const database = process.env.sql_database;
const port = process.env.sql_port;