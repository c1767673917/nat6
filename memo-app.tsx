import React, { useState, useEffect } from 'react';
import { memoApi } from './api/index';

const MemoApp = () => {
  const [user, setUser] = useState(null);
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newMemo, setNewMemo] = useState('');

  useEffect(() => {
    if (user) {
      loadMemos();
    }
  }, [user]);

  const loadMemos = async () => {
    try {
      setLoading(true);
      const response = await memoApi.getMemos();
      setMemos(response.data);
    } catch (err) {
      setError('加载备忘录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (username) => {
    try {
      const response = await memoApi.login(username);
      setUser(response.data);
    } catch (err) {
      setError('登录失败');
    }
  };

  const addMemo = async () => {
    if (newMemo.trim()) {
      try {
        const memo = {
          text: newMemo.trim(),
          completed: false,
          date: new Date().toLocaleString('zh-CN')
        };
        const response = await memoApi.createMemo(memo);
        setMemos([response.data, ...memos]);
        setNewMemo('');
      } catch (err) {
        setError('添加备忘录失败');
      }
    }
  };

  // ... 修改其他方法为异步操作 ...

  return (
    // ... 保留原有代码 ...
  );
};

export default MemoApp; 