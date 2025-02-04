const express = require('express')
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
const path = require('path')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

let db

// 初始化数据库
async function initDB() {
  db = await open({
    filename: path.join(__dirname, 'data', 'memos.db'),
    driver: sqlite3.Database
  })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS memos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0,
      username TEXT NOT NULL,
      createTime DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

// 登录接口
app.post('/api/login', (req, res) => {
  const { username } = req.body
  if (!username) {
    return res.status(400).json({ error: '用户名不能为空' })
  }
  res.json({ username })
})

// 获取备忘录列表
app.get('/api/memos', async (req, res) => {
  const { username } = req.query
  try {
    const memos = await db.all(
      'SELECT * FROM memos WHERE username = ? ORDER BY createTime DESC',
      username
    )
    res.json(memos)
  } catch (err) {
    res.status(500).json({ error: '获取备忘录失败' })
  }
})

// 添加备忘录
app.post('/api/memos', async (req, res) => {
  const { content, username } = req.body
  try {
    const result = await db.run(
      'INSERT INTO memos (content, username) VALUES (?, ?)',
      content,
      username
    )
    const memo = await db.get('SELECT * FROM memos WHERE id = ?', result.lastID)
    res.json(memo)
  } catch (err) {
    res.status(500).json({ error: '添加备忘录失败' })
  }
})

// 切换完成状态
app.put('/api/memos/:id/toggle', async (req, res) => {
  const { id } = req.params
  try {
    await db.run(
      'UPDATE memos SET completed = NOT completed WHERE id = ?',
      id
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: '更新状态失败' })
  }
})

// 删除备忘录
app.delete('/api/memos/:id', async (req, res) => {
  const { id } = req.params
  try {
    await db.run('DELETE FROM memos WHERE id = ?', id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: '删除备忘录失败' })
  }
})

// 启动服务器
initDB().then(() => {
  app.listen(3000, () => {
    console.log('服务器运行在 http://localhost:3000')
  })
}) 