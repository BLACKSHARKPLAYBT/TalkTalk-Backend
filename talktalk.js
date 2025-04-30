const express = require('express');
const db = require('./database');
const app = express();
const port = 1000;
const cors = require('cors');

// 使用中间件
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log('收到请求:', req.method, req.url);
    next();
});

let dbRouter = express.Router();
dbRouter.post('/db', (req, res) => {
    const data = req.body; // 获取请求体数据
    console.log('收到数据:', data); // 打印请求体
    res.json({ message: '数据库路由收到数据！', received: data });
});

dbRouter.get('/db', (req, res) => {
    console.log('收到 /db GET 请求');
    res.json({ message: '这是 /db 的 GET 请求，仅用于调试' });
});
app.use('/db', dbRouter);

// 处理 POST 请求
app.post('/', (req, res) => {
    const data = req.body; // 获取请求体数据
    console.log('收到数据:', data); // 打印请求体
    res.send('数据已收到，后端运行正常！😉');
});

// 调试：捕获 404
app.use((req, res) => {
    console.log('未匹配的请求:', req.method, req.url);
    res.status(404).json({ message: '路由不存在' });
});
// 启动服务器
app.listen(port, () => {
    console.log('开始运行:');
    console.log(`http://localhost:${port}`);
});

//