const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// 连接MongoDB
mongoose.connect(process.env.MONGODB_URI);

// 定义Schema
const MemoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
  date: String,
  userId: String
});

const Memo = mongoose.model('Memo', MemoSchema);

// API路由
app.post('/api/auth/login', (req, res) => {
  const { username } = req.body;
  // 简单的用户认证
  res.json({ username });
});

app.get('/api/memos', async (req, res) => {
  const memos = await Memo.find({ userId: req.query.userId });
  res.json(memos);
});

app.post('/api/memos', async (req, res) => {
  const memo = new Memo({ ...req.body, userId: req.query.userId });
  await memo.save();
  res.json(memo);
});

// ... 其他API端点 ...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 