export interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
      first_name?: string;
      title?: string;
    };
    date: number;
    text?: string;
  };
}

export async function getTelegramUpdates(token: string): Promise<TelegramUpdate[]> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getUpdates?timeout=1`);
    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }
    const data = await response.json();
    if (data.ok) {
      return data.result as TelegramUpdate[];
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch Telegram updates:", error);
    return [];
  }
}

export async function sendTelegramMessage(token: string, chatId: string, text: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown",
      }),
    });
    const data = await response.json();
    return data.ok === true;
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
    return false;
  }
}
