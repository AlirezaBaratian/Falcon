const TelegramBot = require("node-telegram-bot-api");
const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect("mongodb://localhost:27017/subnetvpn", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Registeration = mongoose.model("Registeration", {
  name: String,
  recommender: String,
  username: String,
  pin: String,
  contact: String,
  telegram_id: String,
  telegram_first_name: String,
  telegram_last_name: String,
  telegram_user_name: String,
});

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

var usersData = {};
const startId = 1;
const mainMenu = {
  register: "🚪 ثبت نام",
  about: "ℹ️ درباره ساب‌نت",
  help: "❓ راهنما",
};

bot.on("message", (msg) => {
  const recipient = msg.from.id;
  const messageText = msg.text;
  if (messageText === "/start") {
    Registeration.findOne(
      { telegram_id: msg.from.id },
      (err, foundRegisteration) => {
        if (err) {
          console.log(err);
          bot.sendMessage(
            recipient,
            "😣 متأسفانه در ثبت نام شما مشکلی پیش آمد \n 😅 دوباره می‌توانید با دستور /start شانس‌تون رو امتحان کنید",
            { reply_to_message_id: msg.message_id }
          );
        } else {
          if (foundRegisteration) {
            bot.sendMessage(recipient, "⛔️ شما قبلاً ثبت نام کرده‌اید!", {
              reply_to_message_id: msg.message_id,
            });
          } else {
            bot.sendMessage(
              recipient,
              "👋🏻 سلام دوست عزیز، خوش اومدی! \n لطفاً دستور خود را ازمنوی زیر انتخاب کنید 👇",
              {
                reply_to_message_id: msg.message_id,
                reply_markup: {
                  keyboard: [
                    [mainMenu.register, mainMenu.about, mainMenu.help],
                  ],
                  resize_keyboard: true,
                },
              }
            );
          }
        }
      }
    );
  } else {
    if (Object.values(mainMenu).includes(messageText)) {
      switch (messageText) {
        case "🚪 ثبت نام":
          Registeration.findOne(
            { telegram_id: msg.from.id },
            (err, foundRegisteration) => {
              if (err) {
                console.log(err);
                bot.sendMessage(
                  recipient,
                  "😣 متأسفانه در ثبت نام شما مشکلی پیش آمد \n 😅 دوباره می‌توانید با دستور /start شانس‌تون رو امتحان کنید",
                  { reply_to_message_id: msg.message_id }
                );
              } else {
                if (foundRegisteration) {
                  bot.sendMessage(
                    recipient,
                    "⛔️ شما قبلاً ثبت نام کرده‌اید!",
                    {
                      reply_to_message_id: msg.message_id,
                    }
                  );
                } else {
                  bot.sendMessage(
                    recipient,
                    "👋 سلام دوست عزیز، خوش اومدی! \n 🤔 اسم شریف شما چیه؟",
                    {
                      reply_to_message_id: msg.message_id,
                      reply_markup: { remove_keyboard: true },
                    }
                  );
                  usersData[recipient] = {};
                  usersData[recipient].id = 3;
                }
              }
            }
          );
          break;
        case "ℹ️ درباره ساب‌نت":
          bot.sendMessage(
            recipient,
            "♻️ اینترنت آزاد به واسطه VPN \n❔ برای اطلاعات بیشتر از کانال بازدید کنید \n📣 آدرس کانال: @subnetvpn",
            { reply_to_message_id: msg.message_id }
          );
          break;
        case "❓ راهنما":
          bot.sendMessage(
            recipient,
            "برای ثبت نام گزینه **🚪 ثبت نام** را از منوی ربات انتخاب کنید",
            { reply_to_message_id: msg.message_id, parse_mode: "Markdown" }
          );
          break;
      }
    } else {
      if (!usersData[recipient]) {
        if (messageText === mainMenu.register) {
          usersData[recipient] = {};
          usersData[recipient].id = 3;
          bot.sendMessage(recipient, "لطفاً نام خودتون رو ارسال کنید 🙏", {
            reply_to_message_id: msg.message_id,
          });
        } else {
          bot.sendMessage(
            recipient,
            "😣 متاُسفانه دستور شما قابل شناسایی نیست \n 🙏🏻 جهت ثبت نام از دستور /start استفاده کنید",
            { reply_to_message_id: msg.message_id }
          );
        }
      } else {
        switch (usersData[recipient].id) {
          case startId + 2:
            bot.sendMessage(
              recipient,
              "👌 چه نام زیبایی! \n 🤔 معرف شما چه کسی هست؟",
              { reply_to_message_id: msg.message_id }
            );
            usersData[recipient].telegramUserId = recipient;
            usersData[recipient].telegramFirstName = msg.from.first_name;
            usersData[recipient].telegramLastName = msg.from.last_name;
            usersData[recipient].telegramUserName = msg.from.username;
            usersData[recipient].fullName = messageText;
            break;
          case startId + 4:
            bot.sendMessage(
              recipient,
              `✋ از آشنایی با شما خوشبختیم، ${usersData[recipient].fullName} عزیز! \n 🙏🏻 لطفاً یک راه ارتباطی مانند شماره تلفن یا آیدی در شبکه‌های اجتماعی برای ارسال پروفایل VPN وارد کنید`,
              { reply_to_message_id: msg.message_id }
            );
            usersData[recipient].recommender = messageText;
            break;
          case startId + 6:
            bot.sendMessage(
              recipient,
              "👏 بسیار عالی، حالا نوبت وارد کردن یک نام کاربری دلخواه برای شماست! \n مثلاً: mohammad-mohammadi",
              { reply_to_message_id: msg.message_id }
            );
            usersData[recipient].contact = messageText;
            break;
          case startId + 8:
            bot.sendMessage(
              recipient,
              "در آخر هم یک پسورد عددی و حداقل ۶ رقمی برامون لطفاً ارسال کنید؛ مثلا: 123456 😅",
              { reply_to_message_id: msg.message_id }
            );
            usersData[recipient].username = messageText;
            break;
          case startId + 10:
            usersData[recipient].pin = messageText;
            const newRegisteration = new Registeration({
              telegram_id: usersData[recipient].telegramUserId,
              telegram_first_name: usersData[recipient].telegramFirstName,
              telegram_last_name: usersData[recipient].telegramLastName,
              telegram_user_name: usersData[recipient].telegramUserName,
              name: usersData[recipient].fullName,
              recommender: usersData[recipient].recommender,
              contact: usersData[recipient].contact,
              username: usersData[recipient].username,
              pin: usersData[recipient].pin,
            });
            newRegisteration
              .save()
              .then(() => {
                bot.sendMessage(
                  recipient,
                  "🎉 ثبت نام شما کامل شد،‌ به زودی با شما در تماس خواهیم بود.",
                  { reply_to_message_id: msg.message_id }
                );
                delete usersData[recipient];
              })
              .catch((err) => {
                console.log(err);
                bot.sendMessage(
                  recipient,
                  "😣 متأسفانه در ثبت نام شما مشکلی پیش آمد \n 😅 دوباره می‌توانید با دستور /start شانس‌تون رو امتحان کنید",
                  { reply_to_message_id: msg.message_id }
                );
              });
            break;
        }
        if (usersData[recipient]) {
          usersData[recipient].id += 2;
        }
      }
    }
  }
});

bot.on("polling_error", (err) => {
  console.log(err);
});
