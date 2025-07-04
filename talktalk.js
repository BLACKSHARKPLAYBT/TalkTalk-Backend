const express = require('express')
const dataB = require('./database')
const app = express()
const path = require('path')
const port = 1000
const cors = require('cors')

app.use(cors())
app.use(express.json())
// 优先配置静态资源目录
app.use(express.static(path.join(__dirname, 'public')))

// 处理 POST 请求
app.post('/db', (req, res) => {
    const data = req.body // 获取请求体数据
    console.log('收到数据:') // 打印请求体
    dataB.addAritcle(data)
    res.json({ message: '数据库路由收到数据！', received: data })
});
app.post('/register', async (req, res) => { // 将路由处理函数也标记为 async
    const data = req.body;
    console.log('收到数据:');
    const result = await dataB.addUser(data);
    console.log(result);
    res.json(result);
})
app.post('/login', async (req, res) => {
    const data = req.body
    console.log('收到数据:', data)
    const result = await dataB.userSelect(data)
    res.json(result)
})

app.post('/getArticle', async (req, res) => {
        console.log('收到获取文章请求');
        let data = req.body;
        const articles = await dataB.getArticle(data);
        res.json(articles);
});

app.get('/getClassify', async (req, res) => {
 console.log('收到获取分类请求');
 const classify = await dataB.getClassify();
 res.json(classify);
})

app.post('/getContent',async (req, res) => {
    console.log('收到获取内容请求');
    let data = req.body;
    const content = await dataB.getContent(data);
    res.json(content);
})

app.post('/getUserContent',async (req, res) => {
    console.log('收到获取用户内容请求');
    let data = req.body;
    const content = await dataB.getUserContent(data);
    res.json(content);
})

app.post('/getTagArticle',async (req, res) => {
    console.log('收到获取标签文章请求');
    let data = req.body;
    const content = await dataB.getTagArticle(data);
    res.json(content);
})


app.post('/admin',async (req, res) => {
    console.log('收到获取用户请求');
    let data = req.body;
    const content = await dataB.admin(data);
    res.json(content);
})
app.post('/', (req, res) => {
    res.send('数据已收到，后端运行正常！ 😉');
})

// 处理根路径请求
app.get('/', (req, res) => {
    res.send('欢迎访问 Talk Talk 后端服务');
})
// 启动服务器
app.listen(port, () => {
    console.log('开始运行:')
    console.log(`http://localhost:${port}`)
})