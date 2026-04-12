import axios from "axios";

export const sendTelegramMessage = async (chatId, message) => {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: "HTML"
    });
  } catch (error) {
    console.error("Telegram send error:", error.message);
  }
};