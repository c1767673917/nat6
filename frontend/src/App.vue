<template>
  <div class="app-container">
    <!-- 登录页面 -->
    <div v-if="!username" class="login-container">
      <div class="login-card">
        <h1>登录备忘录</h1>
        <div class="login-form">
          <input 
            v-model="loginName" 
            placeholder="输入用户名"
            @keyup.enter="login"
            class="input-primary"
          >
          <button class="btn-primary" @click="login">开始使用</button>
        </div>
      </div>
    </div>

    <!-- 备忘录主页面 -->
    <div v-else class="memo-page">
      <div class="header">
        <h1>{{ username }} 的备忘录</h1>
        <button class="btn-logout" @click="logout">
          <span class="logout-icon">⇦</span>
          退出
        </button>
      </div>

      <!-- 添加新备忘 -->
      <div class="add-memo">
        <input 
          v-model="newMemo" 
          placeholder="写下你的新备忘..."
          @keyup.enter="addMemo"
          class="input-primary"
        >
        <button class="btn-add" @click="addMemo">
          <span class="plus-icon">+</span>
        </button>
      </div>

      <!-- 备忘录列表 -->
      <div class="memo-list">
        <div v-for="memo in memos" 
             :key="memo.id" 
             class="memo-card"
        >
          <!-- 编辑模式 -->
          <div v-if="editingId === memo.id" class="edit-mode">
            <input 
              v-model="editText"
              class="input-edit"
              @keyup.enter="saveEdit"
            >
            <div class="edit-buttons">
              <button @click="saveEdit" class="btn-icon btn-save">
                <span class="check-icon">✓</span>
              </button>
              <button @click="cancelEdit" class="btn-icon btn-cancel">
                <span class="cancel-icon">×</span>
              </button>
            </div>
          </div>

          <!-- 显示模式 -->
          <div v-else class="memo-content">
            <div class="memo-main">
              <span :class="{ 'memo-completed': memo.completed }">
                {{ memo.content }}
              </span>
              <div class="memo-actions">
                <button 
                  @click="toggleMemo(memo.id)"
                  :class="['btn-icon', memo.completed ? 'btn-completed' : '']"
                >
                  <span class="check-icon">✓</span>
                </button>
                <button @click="startEdit(memo)" class="btn-icon">
                  <span class="edit-icon">✎</span>
                </button>
                <button @click="deleteMemo(memo.id)" class="btn-icon btn-delete">
                  <span class="delete-icon">×</span>
                </button>
              </div>
            </div>
            <span class="memo-time">{{ formatTime(memo.createTime) }}</span>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="memos.length === 0" class="empty-state">
          还没有备忘录，开始添加吧！
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_BASE = '/api'

export default {
  setup() {
    const username = ref('')
    const loginName = ref('')
    const newMemo = ref('')
    const memos = ref([])
    const editingId = ref(null)
    const editText = ref('')

    const login = async () => {
      if (!loginName.value) return
      try {
        const res = await axios.post(`${API_BASE}/login`, {
          username: loginName.value
        })
        username.value = loginName.value
        localStorage.setItem('username', loginName.value)
        fetchMemos()
      } catch (err) {
        alert('登录失败')
      }
    }

    const logout = () => {
      username.value = ''
      localStorage.removeItem('username')
      memos.value = []
    }

    const addMemo = async () => {
      if (!newMemo.value) return
      try {
        const res = await axios.post(`${API_BASE}/memos`, {
          content: newMemo.value,
          username: username.value
        })
        memos.value.unshift(res.data)
        newMemo.value = ''
      } catch (err) {
        alert('添加失败')
      }
    }

    const toggleMemo = async (id) => {
      try {
        await axios.put(`${API_BASE}/memos/${id}/toggle`)
        const memo = memos.value.find(m => m.id === id)
        if (memo) memo.completed = !memo.completed
      } catch (err) {
        alert('更新失败')
      }
    }

    const startEdit = (memo) => {
      editingId.value = memo.id
      editText.value = memo.content
    }

    const saveEdit = async () => {
      if (!editText.value) return
      try {
        await axios.put(`${API_BASE}/memos/${editingId.value}`, {
          content: editText.value
        })
        const memo = memos.value.find(m => m.id === editingId.value)
        if (memo) memo.content = editText.value
        editingId.value = null
      } catch (err) {
        alert('更新失败')
      }
    }

    const cancelEdit = () => {
      editingId.value = null
      editText.value = ''
    }

    const deleteMemo = async (id) => {
      try {
        await axios.delete(`${API_BASE}/memos/${id}`)
        memos.value = memos.value.filter(m => m.id !== id)
      } catch (err) {
        alert('删除失败')
      }
    }

    const fetchMemos = async () => {
      try {
        const res = await axios.get(`${API_BASE}/memos?username=${username.value}`)
        memos.value = res.data
      } catch (err) {
        alert('获取备忘录失败')
      }
    }

    const formatTime = (time) => {
      return new Date(time).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }

    onMounted(() => {
      const savedUsername = localStorage.getItem('username')
      if (savedUsername) {
        username.value = savedUsername
        fetchMemos()
      }
    })

    return {
      username,
      loginName,
      newMemo,
      memos,
      editingId,
      editText,
      login,
      logout,
      addMemo,
      toggleMemo,
      startEdit,
      saveEdit,
      cancelEdit,
      deleteMemo,
      formatTime
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #f9fafb;
  color: #1f2937;
}

.app-container {
  min-height: 100vh;
  padding: 1rem;
}

/* 登录页面样式 */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 28rem;
}

.login-card h1 {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 主页面样式 */
.memo-page {
  max-width: 42rem;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 1.875rem;
  font-weight: bold;
  color: #1f2937;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: #4b5563;
  background: none;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-logout:hover {
  background-color: #f3f4f6;
}

.add-memo {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.input-primary {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
}

.input-primary:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59,130,246,0.1);
}

.btn-add {
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-add:hover {
  background-color: #2563eb;
}

.plus-icon {
  font-size: 1.5rem;
  line-height: 1;
}

/* 备忘录卡片样式 */
.memo-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.memo-card {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.memo-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.memo-content {
  flex: 1;
  white-space: pre-wrap;
  word-break: break-word;
}

.memo-completed {
  color: #9ca3af;
  text-decoration: line-through;
}

.memo-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  padding: 0.25rem;
  background: none;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-completed {
  color: #10b981;
}

.btn-completed:hover {
  background-color: #ecfdf5;
}

.btn-delete:hover {
  background-color: #fef2f2;
  color: #ef4444;
}

.edit-mode {
  display: flex;
  gap: 0.5rem;
}

.input-edit {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
}

.input-edit:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59,130,246,0.1);
}

.memo-time {
  display: block;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}

.empty-state {
  text-align: center;
  color: #6b7280;
  padding: 2rem 0;
}

@media (max-width: 640px) {
  .header h1 {
    font-size: 1.5rem;
  }
  
  .memo-card {
    padding: 0.75rem;
  }
  
  .btn-icon {
    opacity: 1;
  }
}
</style> 