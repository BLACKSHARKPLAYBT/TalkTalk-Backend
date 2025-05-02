const express = require('express');
const dataB = require('./database');
const app = express();
const port = 1000;


app.use(express.json());
// 处理 POST 请求
app.post('/db', (req, res) => {
    const data = req.body; // 获取请求体数据
    console.log('收到数据:'); // 打印请求体
    dataB.addAritcle(data);
    res.json({ message: '数据库路由收到数据！', received: data });
});


app.post('/', (req, res) => {
    res.send('数据已收到，后端运行正常！😉');
});

// 启动服务器
app.listen(port, () => {
    console.log('开始运行:');
    console.log(`http://localhost:${port}`);
});

//