import React, { useState, useEffect } from 'react';

const MemoApp = () => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser || null;
  });

  const [memos, setMemos] = useState([]);

  // 加载备忘录
  useEffect(() => {
    if (user) {
      fetch(`/api/memos/${user}`)
        .then(res => res.json())
        .then(data => setMemos(data));
    }
  }, [user]);

  // 保存备忘录
  useEffect(() => {
    if (user) {
      fetch(`/api/memos/${user}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memos),
      });
    }
  }, [memos]);

  // ... rest of the existing code ...
};

export default MemoApp; 