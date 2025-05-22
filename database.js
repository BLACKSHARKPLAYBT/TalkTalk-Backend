const mysql = require('mysql2/promise');
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
//插入功能
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
    const {name, date, password, sex, description, avatar, banner, phone, email} = data;

    try {
        const checkUserSql = `SELECT * FROM user WHERE NAME = ?`;
        const [existingUsers] = await pool.execute(checkUserSql, [name]);

        if (existingUsers.length > 0) {
            console.log('用户已存在');
            return {
                status:409,
                success: false,
                message: '用户已存在',
            };
        }

        const insertUserSql = 'INSERT INTO user (NAME, DATE, PASSWORD, sex, description, avatar, banner, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [name, date, password, sex, description, avatar, banner, phone, email];
        const [insertResult] = await pool.execute(insertUserSql, values);
        
        console.log('用户插入成功:', insertResult);
        return { // 插入成功后返回统一格式的对象
            success: true,
            message: '用户注册成功',
            userId: insertResult.insertId 
        };

    } catch (err) {
        console.log(`处理用户注册出错，原因为：${err}`);
        return { // 发生错误时返回统一格式的对象
            success: false,
            message: '用户注册失败：' + err.message 
        }
    }
}
//获取表内容
module.exports.userSelect = async function userSelect(data){
    const {username, password} = data;
    const us = `select * from user where NAME='${username}'`
    const us_rs = await pool.execute(us);
    try {
        if (us_rs[0].length === 0) {
            return ({
                status: 401,
                success: false
            })
        } else if (us_rs[0].length === 2) {
            return ({
                status: 401,
                success:false
            })
        } else {
            const sql = `select * from user where NAME='${username}' and PASSWORD='${password}'`
            const sql_db = await pool.execute(sql)
            const ck = sql_db[0][0]
            const sql2 = `select * from user where NAME='${username}'`
            const sql_db2 = await pool.execute(sql2)
            const ck2 = sql_db2[0][0]

            if (ck === undefined   ) {
                return ({
                    status: 401,
                    success: false,
                    message: '密码错误'
                })
            } else{
                return ({
                    status: 200,
                    success: true,
                    message: '登录成功',
                    data: ck2
                })
            }
        }
    } catch (err) {
        console.log(`查询出错，原因为：${err}`);
    }
}


module.exports.getArticle = async function getArticle(){
    const sql = `select * from article`
    try {
        const [data] = await pool.execute(sql);
        console.log('查询到的文章数据:', data);  // 添加日志
        if (!data || data.length === 0) {
            console.log('文章表为空');
            return [];
        }
        return data;
    }
    catch (err) {
        console.log(`获取文章出错，原因为：${err}`);
        throw err;  // 抛出错误以便上层捕获
    }
}

module.exports.getClassify = async function getClassify(){
    const sql = `select DISTINCT label from article`
    let res = await pool.execute(sql)
    return {
        status: 200,
        success: true,
        data: res[0]
    }
}

// 在连接池创建后添加验证
pool.getConnection()
    .then(conn => {
        console.log('成功连接到数据库');
        conn.release()})
    .catch(err => {
        console.error('数据库连接失败:', err);
    });
