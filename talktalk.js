const express = require('express');
const dataB = require('./database');
const app = express();
const path = require('path');
const port = 1000;
const cors = require('cors');

app.use(cors());
app.use(express.json());

// 优先配置静态资源目录
app.use(express.static(path.join(__dirname, 'public')));

// 处理 POST 请求
app.post('/db', (req, res) => {
    const data = req.body; // 获取请求体数据
    console.log('收到数据:'); // 打印请求体
    dataB.addAritcle(data);
    res.json({ message: '数据库路由收到数据！', received: data });
});
app.post('/register', (req, res) => {
    const data = req.body;
    console.log('收到数据:');
    dataB.addUser(data);
    res.json({ message: '数据库路由收到数据！', received: data });
    console.log(`${data}`)
});


app.post('/', (req, res) => {
    res.send('数据已收到，后端运行正常！ 😉');
});

// 处理根路径请求
app.get('/', (req, res) => {
    res.send('欢迎访问 Talk Talk 后端服务');
});

// 启动服务器
app.listen(port, () => {
    console.log('开始运行:');
    console.log(`http://localhost:${port}`);
});