const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const Io = require("./server");

// copy paste from stackoverflow: https://stackoverflow.com/questions/8027423/how-to-check-if-a-string-is-a-valid-hex-color-representation/8027444
const isHex = (hex) => {
  return (
    typeof hex === "string" && hex.length === 6 && !isNaN(Number("0x" + hex))
  );
};

const bot = new TelegramBot("1600543703:AAEiV8gBWyexwchKcIW35153eVyFQ8nbmgI", {
  polling: true,
});

bot.onText(/\/start/, (msg, _) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  let url = `http://localhost:8080/@${username}`;

  let message = `Hola 👋 , @${username}\n\n🎱 Your magic url 👉 ${url}\n\n\n⚠️ NOTE: <i> <b>FIRST OPEN THE URL THEN PLAY</b> </i>🙂`;
  bot.sendMessage(chatId, message, { parse_mode: "HTML" });
});

bot.onText(/\/bg (.+)/, (msg, _) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  const text = msg.text.replace("/bg ", "").replace("#", "").trim();

  if (isHex(text)) {
    Io.sockets.emit("message", {
      username: `@${username}`,
      body: `#${text}`,
      type: "background",
    });
    bot.sendMessage(chatId, "Successfully updated background color ✅");
  } else {
    bot.sendMessage(chatId, "Please provide valid hex color 🙃");
  }
});

bot.onText(/\/bodytext (.+)/, (msg, _) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  const text = msg.text.replace("/bodytext ", "").trim();

  // 🤔 https://stackoverflow.com/questions/15241915/how-to-change-css-property-using-javascript
  Io.sockets.emit("message", {
    username: `@${username}`,
    body: text,
    type: "body_text",
  });
  bot.sendMessage(chatId, "Successfully updated body text ✅");
});
