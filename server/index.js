const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

// 数据文件路径
const DATA_FILE = path.join(__dirname, 'data', 'memos.json');

// 确保数据目录存在
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

// 如果数据文件不存在，创建空数据文件
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}));
}

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

// 获取用户的备忘录
app.get('/api/memos/:username', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    const username = req.params.username;
    res.json(data[username] || []);
});

// 保存用户的备忘录
app.post('/api/memos/:username', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    const username = req.params.username;
    data[username] = req.body;
    fs.writeFileSync(DATA_FILE, JSON.stringify(data));
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 