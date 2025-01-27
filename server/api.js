const express = require('express');
const axios = require('axios');
const router = express.Router();

// Durian API配置（需替换为实际值）
const DURIAN_API_KEY = process.env.DURIAN_API_KEY;
const DURIAN_BASE_URL = 'https://api.durianrcs.com/v1';

// 发送短信接口
router.post('/send-sms', async (req, res) => {
  try {
    const response = await axios.post(`${DURIAN_BASE_URL}/messages`, {
      recipient: req.body.phone,
      text: req.body.message
    }, {
      headers: {
        'Authorization': `Bearer ${DURIAN_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({
      success: true,
      messageId: response.data.id
    });
  } catch (error) {
    console.error('API调用失败:', error.response?.data);
    res.status(500).json({
      success: false,
      message: error.response?.data?.error || '短信发送失败'
    });
  }
});

module.exports = router; 