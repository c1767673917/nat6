<template>
  <div class="app-container">
    <header>
      <h1>简易备忘录</h1>
      <div v-if="username" class="user-info">
        {{ username }} | <button @click="logout">退出</button>
      </div>
    </header>

    <div v-if="!username" class="login-container">
      <input 
        v-model="loginName" 
        placeholder="请输入用户名"
        @keyup.enter="login"
      >
      <button @click="login">登录</button>
    </div>

    <div v-else class="memo-container">
      <div class="add-memo">
        <input 
          v-model="newMemo" 
          placeholder="输入新的备忘录"
          @keyup.enter="addMemo"
        >
        <button @click="addMemo">添加</button>
      </div>

      <div class="memo-list">
        <div v-for="memo in memos" :key="memo.id" class="memo-item">
          <input 
            type="checkbox" 
            :checked="memo.completed"
            @change="toggleMemo(memo.id)"
          >
          <span :class="{ completed: memo.completed }">{{ memo.content }}</span>
          <span class="memo-time">{{ formatTime(memo.createTime) }}</span>
          <button @click="deleteMemo(memo.id)" class="delete-btn">删除</button>
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
      return new Date(time).toLocaleString()
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
      login,
      logout,
      addMemo,
      toggleMemo,
      deleteMemo,
      formatTime
    }
  }
}
</script>

<style>
.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.login-container {
  text-align: center;
  margin: 50px 0;
}

.memo-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.completed {
  text-decoration: line-through;
  color: #999;
}

.memo-time {
  margin-left: auto;
  margin-right: 10px;
  color: #666;
  font-size: 0.9em;
}

.delete-btn {
  color: red;
}

input {
  padding: 8px;
  margin-right: 10px;
}

button {
  padding: 8px 16px;
  cursor: pointer;
}
</style> 