const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./model/User");
// copy paste from stackoverflow: https://stackoverflow.com/questions/8027423/how-to-check-if-a-string-is-a-valid-hex-color-representation/8027444
const isHex = (hex) => {
  return (
    typeof hex === "string" && hex.length === 6 && !isNaN(Number("0x" + hex))
  );
};

const token = process.env.TOKEN;

const TEXTCOUNT = 160;

mongoose
  .connect(process.env.PRODUCTION_MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(`🪐 Database connected`);
    const Io = require("./server");

    const bot = new TelegramBot(token, {
      polling: true,
    });

    bot.onText(/\/start/, async (msg, _) => {
      const chatId = msg.chat.id;
      const username = msg.from.username;

      // account created ✅
      let user = await User.find({ username: `@${username}` });
      if (user.length <= 0) {
        const data = new User({ username: `@${username}` });
        await data.save();
      }
      let baseUrl = process.env.URL || `http://localhost:8080/@`;
      let url = baseUrl + username;

      let message = `Hola 👋 , @${username}\n\n🎱 Your magic url 👉 ${url}`;
      bot.sendMessage(chatId, message, { parse_mode: "HTML" });
    });

    bot.onText(/\/url/, (msg, _) => {
      const chatId = msg.chat.id;
      const username = msg.from.username;

      let baseUrl = process.env.URL || `http://localhost:8080/@`;
      let url = baseUrl + username;

      bot.sendMessage(chatId, url);
    });

    bot.onText(/\/help/, (msg, _) => {
      const chatId = msg.chat.id;

      let message =
        "Hello 👋, I can help you to play with magic website.\n\nYou can control me & magic website by sending these commands:\n\n/bg <i>hex color</i> - Change / Update magic website background color\n\n<s>/bodytext <i>text</i>  - Change / Update magic website body text</s>\n\n/body <i>content</i> - Change / Update magic website body content\n\n/url - your custom magic url\n\n/meta - change meta description\n\n💻 Happy playing";
      bot.sendMessage(chatId, message, { parse_mode: "HTML" });
    });

    bot.onText(/\/bg (.+)/, async (msg, _) => {
      const chatId = msg.chat.id;
      const username = msg.from.username;

      const text = msg.text.replace("/bg ", "").replace("#", "").trim();

      if (isHex(text)) {
        try {
          await User.updateOne(
            { username: `@${username}` },
            { $set: { background: `#${text}` } }
          );
          Io.sockets.emit("message", {
            username: `@${username}`,
            body: `#${text}`,
            type: "background",
          });
          bot.sendMessage(chatId, "Successfully updated background color ✅");
        } catch (_) {
          bot.sendMessage(chatId, "😭 Something went wrong");
        }
      } else {
        bot.sendMessage(chatId, "Please provide valid hex color 🙃");
      }
    });

    bot.onText(/\/bodytext (.+)/,async (msg, _) => {
      const chatId = msg.chat.id;
      let message = "❌ /bodytext <i>text</i> was deprecated in <b>Magic bot 1.0.3</b> . Replaced by /body <i>content</i>";
      bot.sendMessage(chatId, message,{ parse_mode: "HTML" });
    });

    bot.onText(/\/body (.+)/,async (msg, _) => {
      const chatId = msg.chat.id;
      const username = msg.from.username;

      const text = msg.text.replace("/body ", "").trim();

      // 🤔 https://stackoverflow.com/questions/15241915/how-to-change-css-property-using-javascript
      try {
        await User.updateOne(
          { username: `@${username}` },
          { $set: { body_text: text } }
        );
        Io.sockets.emit("message", {
          username: `@${username}`,
          body: text,
          type: "body_text",
        });
        bot.sendMessage(chatId, "Successfully updated body text ✅");
      } catch (_) {
        bot.sendMessage(chatId, "😭 Something went wrong");
      }
    });

    bot.onText(/\/meta (.+)/,async (msg, _) => {
      const chatId = msg.chat.id;
      const username = msg.from.username;

      const text = msg.text.replace("/meta ", "").replace("\n","").trim();

      try {
        if (text.length <= TEXTCOUNT) {
          await User.updateOne(
            { username: `@${username}` },
            { $set: { meta: text } }
          );
          bot.sendMessage(chatId, "Successfully updated meta description ✅");
        } else {
          bot.sendMessage(chatId,`❌ Sorry description text is limited up to ${TEXTCOUNT} characters.Your current character count is ${text.length} 🌝`)
        }
      } catch (_) {
        bot.sendMessage(chatId, "😭 Something went wrong");
      }
    });

  })
  .catch(console.log);
