const express = require('express');
const router = express.Router();
const Memo = require('../models/Memo');

// 获取用户的所有备忘录
router.get('/memos/:userId', async (req, res) => {
  try {
    const memos = await Memo.find({ userId: req.params.userId })
      .sort({ date: -1 });
    res.json(memos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 创建新备忘录
router.post('/memos', async (req, res) => {
  const memo = new Memo({
    userId: req.body.userId,
    text: req.body.text
  });

  try {
    const newMemo = await memo.save();
    res.status(201).json(newMemo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 更新备忘录
router.patch('/memos/:id', async (req, res) => {
  try {
    const memo = await Memo.findById(req.params.id);
    if (req.body.text != null) {
      memo.text = req.body.text;
    }
    if (req.body.completed != null) {
      memo.completed = req.body.completed;
    }
    const updatedMemo = await memo.save();
    res.json(updatedMemo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 删除备忘录
router.delete('/memos/:id', async (req, res) => {
  try {
    await Memo.findByIdAndDelete(req.params.id);
    res.json({ message: '备忘录已删除' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 