import { useState } from 'react';
import axios from 'axios';

const SMSForm = () => {
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('86');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('/api/send-sms', {
        phone: `${countryCode}${phone}`,
        message
      });
      
      alert(`发送成功！消息ID: ${response.data.messageId}`);
    } catch (error) {
      alert(`发送失败: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
          <option value="86">中国 +86</option>
          <option value="1">美国 +1</option>
          <option value="44">英国 +44</option>
        </select>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
          placeholder="手机号码"
          required
        />
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="短信内容"
        required
        maxLength="160"
      />
      <button type="submit" disabled={loading}>
        {loading ? '发送中...' : '发送短信'}
      </button>
    </form>
  );
};

export default SMSForm; 