const db = require('mysql');
const {auth} = require("mysql/lib/protocol/Auth");
require('dotenv').config();
const host = process.env.sql_host;
const user = process.env.sql_user;
const password = process.env.sql_password;
const database = process.env.sql_database;
const port = process.env.sql_port;

console.log(`host:${host},user:${user},password:${password},database:${database},port:${port}`);
const con = db.createConnection({
    host: host,
    user: user,
    password: password,
    database: database,
    port: port,
    connectTimeout: 10000 // 增加连接超时时间为 10 秒
});

// 先连接数据库
con.connect((err) => {
    if (err) {
        console.log(`数据库连接出错，原因为：${err}`);
        return;
    }
    console.log('数据库连接成功');

    let tables = [userTable, articleTable, commentTable, likeTable, followTable, messageTable];
    for (let i in tables) {
        if (tables[i]) {
            con.query(tables[i], (err, result) => {
                if (err) {
                    console.log(`创建表出错，原因为：${err}`);
                } else {
                    console.log('表创建成功');
                }
            });
        }
    }

    // 初始化查询表
    con.query('SHOW TABLES', (err, result) => {
        if (err) {
            console.log(`查询表出错，原因为：${err}`);
        } else {
            console.log(result);
        }
    });
});

module.exports = con;

module.exports.addAritcle = function addArticle(data) {
    const { title, content, category, time, author } = data;
    // 修正表名，使用参数化查询
    const sql = 'INSERT INTO article (title, content, label, DATE, user) VALUES (?, ?, ?, ?, ?)';
    const values = [title, content, category, time, author];
    con.query(sql, values, (err, result) => {
        if (err) {
            console.log(`插入文章出错，原因为：${err}`);
        } else {
            console.log('文章插入成功:', result);
        }
    });
};
const userTable = "CREATE TABLE\n" +
    "IF\n" +
    "  NOT EXISTS USER (\n" +
    "    id INT ( 20 ) NOT NULL auto_increment,\n" +
    "    NAME VARCHAR ( 12 ) NOT NULL,\n" +
    "    sex VARCHAR ( 10 ) NOT NULL,\n" +
    "    DATE VARCHAR ( 20 ) NOT NULL,\n" +
    "    description VARCHAR ( 200 ) NOT NULL,\n" +
    "    PASSWORD VARCHAR ( 20 ) NOT NULL,\n" +
    "    avatar VARCHAR ( 200 ) NOT NULL,\n" +
    "    banner VARCHAR ( 200 ) NOT NULL,\n" +
    "    phone VARCHAR ( 20 ) NOT NULL,\n" +
    "    email VARCHAR ( 20 ) NOT NULL,\n" +
    "    PRIMARY KEY ( id ));"
const articleTable = "CREATE TABLE\n" +
    "IF\n" +
    "  NOT EXISTS aritcle (\n" +
    "    id INT ( 20 ) NOT NULL PRIMARY KEY auto_increment,\n" +
    "    title VARCHAR ( 30 ) NOT NULL,\n" +
    "    content VARCHAR ( 5000 ) NOT NULL,\n" +
    "    label VARCHAR ( 20 ) NOT NULL,\n" +
    "    DATE VARCHAR ( 20 ) NOT NULL,\n" +
    "    user VARCHAR ( 20 ) NOT NULL\n" +
    "  )"
const commentTable = ""
const likeTable = ""
const followTable = ""
const messageTable = ""
/*向表插入数据插入*/
const userTable_insert = ""
const commentTable_insert = ""
const likeTable_insert = ""
const followTable_insert = ""
const messageTable_insert = ""
/*查询表数据*/
const userTable_select = ""
const articleTable_select = ""
const commentTable_select = ""
const likeTable_select = ""
const followTable_select = ""
const messageTable_select = ""
/*删除表数据*/
const userTable_delete = ""
const articleTable_delete = ""
const commentTable_delete = ""
const likeTable_delete = ""
const followTable_delete = ""
const messageTable_delete = ""
/*修改表数据*/
const userTable_update = ""
const articleTable_update = ""
const commentTable_update = ""
const likeTable_update = ""
const followTable_update = ""
const messageTable_update = ""
