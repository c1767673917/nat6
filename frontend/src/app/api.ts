const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.m.loux.us.kg';

export const fetchMemos = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/memos/${userId}`);
  if (!response.ok) throw new Error('获取备忘录失败');
  return response.json();
};

export const createMemo = async (userId: string, text: string) => {
  const response = await fetch(`${API_BASE_URL}/api/memos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, text }),
  });
  if (!response.ok) throw new Error('创建备忘录失败');
  return response.json();
};

export const updateMemo = async (id: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}/api/memos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('更新备忘录失败');
  return response.json();
};

export const deleteMemo = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/api/memos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('删除备忘录失败');
  return response.json();
}; 