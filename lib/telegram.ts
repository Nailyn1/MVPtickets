// lib/services/telegram.ts

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_GROUP_CHAT_ID;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

// Можно использовать тип из нашего dto.ts или просто Any для MVP,
// но лучше опишем интерфейс того, что нам нужно для шаблона
interface TelegramTicketData {
  id: string;
  text: string;
  aiCategory?: string | null;
  aiPriority?: string | null;
  aiSummary?: string | null;
  aiNextStep?: string | null;
}

export async function sendTelegramNotification(
  ticket: TelegramTicketData,
  clientName: string,
) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn("⚠️ Telegram ключи не настроены. Уведомление не отправлено.");
    return;
  }

  // 1. Формируем сообщение прямо здесь
  const priorityIcon = ticket.aiPriority === "Высокий" ? "🚨" : "🔵";
  const shortId = ticket.id.slice(-4);

  const message = `
${priorityIcon} <b>Новая заявка #${shortId}</b>

<b>Клиент:</b> ${clientName}
<b>Категория:</b> ${ticket.aiCategory || "Не определена"}
<b>Приоритет:</b> ${ticket.aiPriority || "Не определен"}

<b>Суть от ИИ:</b>
<i>${ticket.aiSummary || "Анализ не удался"}</i>

<b>Оригинальный текст:</b>
"${ticket.text}"

<b>Рекомендация:</b> ${ticket.aiNextStep || "Проверить вручную"}

👉 <a href="https://mv-ptickets.vercel.app/dashboard">Открыть панель управления</a>
  `;

  // 2. Отправляем в Telegram
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Ошибка от Telegram API:", errorData);
    }
  } catch (error) {
    console.error("❌ Сетевая ошибка при отправке в Telegram:", error);
  }
}
