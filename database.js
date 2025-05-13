const mysql = require('mysql2/promise');
// 确保.env文件包含以下环境变量（需要用户确认）
// sql_host=localhost
// sql_user=root
// sql_password=your_password
// sql_database=talktalk
// sql_port=3306
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.sql_host,
    user: process.env.sql_user,
    password: process.env.sql_password,
    database: process.env.sql_database,
    port: process.env.sql_port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // 添加以下配置
    connectTimeout: 60000, // 连接超时时间（毫秒）
    acquireTimeout: 60000, // 获取连接超时时间（毫秒）
    timeout: 60000, // 查询超时时间（毫秒）
    enableKeepAlive: true, // 启用保持连接
    keepAliveInitialDelay: 0 // 保持连接的初始延迟
});

// 初始化表
(async () => {
    const maxRetries = 3;
    let retryCount = 0;
    
    const initTables = async () => {
        try {
            const userTable = `CREATE TABLE IF NOT EXISTS user (
                id INT(20) NOT NULL AUTO_INCREMENT,
                NAME VARCHAR(12) NOT NULL,
                sex VARCHAR(10) NOT NULL,
                DATE VARCHAR(30) NOT NULL,
                description VARCHAR(200) NOT NULL,
                PASSWORD VARCHAR(20) NOT NULL,
                avatar VARCHAR(200) NOT NULL,
                banner VARCHAR(200) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                email VARCHAR(20) NOT NULL,
                PRIMARY KEY (id)
            )`;
    
            // 原错误表名 'aritcle' 需要修正为 'article'
            const articleTable = `CREATE TABLE IF NOT EXISTS article (
                id INT(20) NOT NULL PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(30) NOT NULL,
                content VARCHAR(5000) NOT NULL,
                label VARCHAR(20) NOT NULL,
                DATE VARCHAR(20) NOT NULL,
                user VARCHAR(20) NOT NULL
            )`;
    
            const tables = [userTable, articleTable];
    
            for (const table of tables) {
                await pool.execute(table);
            }
    
            console.log('表初始化完成');
        } catch (err) {
            console.log(`表初始化出错，原因为：${err}`);
            if (retryCount < maxRetries) {
                retryCount++;
                console.log(`尝试第 ${retryCount} 次重新初始化表...`);
                // 等待3秒后重试
                await new Promise(resolve => setTimeout(resolve, 3000));
                return initTables();
            } else {
                console.error('表初始化失败，已达到最大重试次数');
                throw err;
            }
        }
    };

    await initTables();
})();

module.exports.addAritcle = async function addArticle(data) {
    const { title, content, category, time, author } = data;
    const sql = 'INSERT INTO article (title, content, label, DATE, user) VALUES (?, ?, ?, ?, ?)';
    const values = [title, content, category, time, author];

    try {
        const [result] = await pool.execute(sql, values);
        console.log('文章插入成功:', result);
    } catch (err) {
        console.log(`插入文章出错，原因为：${err}`);
    }
};

module.exports.addUser = async function addUser(data) {
    const {name,date,password,sex,description,avatar,banner,phone,email} = data;
    const sql = 'INSERT INTO user (NAME,DATE,PASSWORD,sex,description,avatar,banner,phone,email) VALUES (?, ?, ?,?,?,?,?,?,?)';
    const values = [name,date,password,sex,description,avatar,banner,phone,email];
    try {
        const [result] = await pool.execute(sql, values);
        console.log('用户插入成功:', result);
    }
    catch (err) {
        console.log(`插入用户出错，原因为：${err}`);
    }
}

const userTable = "CREATE TABLE\n" +
    "IF\n" +
    "  NOT EXISTS user (\n" +
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

// 在连接池创建后添加验证
pool.getConnection()
    .then(conn => {
        console.log('成功连接到数据库');
        conn.release();
    })
    .catch(err => {
        console.error('数据库连接失败:', err);
    });
