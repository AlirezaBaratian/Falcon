const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

const commands = {
  start: "/start",
  configs: "🚀 پیام کانفیگ",
  hiddifyBot: "📶 ربات هیدیفای",
};

const mainMenuButtons = [
  [{ text: commands.configs }, { text: commands.hiddifyBot }],
];

const mainMenu = JSON.stringify({
  keyboard: mainMenuButtons,
  resize_keboard: true,
  one_time_keyboard: true,
});

let userPosition = {};

wrongMessage = (userId) => {
  const wrongMessageError = "پیام ارسالی اشتباه است 🥲";
  bot.sendMessage(userId, wrongMessageError);
};

sendUuid = (userId) => {
  uuidMessage = "حالا UUID کاربر را بفرستید 🤗";
  bot.sendMessage(userId, uuidMessage);
};

function sendConfigsMessage(userId, uuid) {
  const configsMessage = `
  <b>📑 لینک‌های اتصال</b>

  👤 این لینک‌ها برای هر کاربر منحصر به فرد هستند.
  <b>⚠️ در صورت به اشتراک گذاشتن آن با افراد دیگر، ترافیک استفاده شده آن‌ها برای شما محاسبه می‌شود.</b>
  
  <b>🚀 کانفیگ مستقیم با پروتکل جدید REALITY (مخصوص برنامه‌های اپدیت شده)</b>


  <code>vless://${uuid}@cdn.thesubnet.online:443?hiddify=1&sni=cdimage.debian.org&type=grpc&alpn=h2&path=vsAOpPEzSsvX2BCPs2RMc6r&serviceName=vsAOpPEzSsvX2BCPs2RMc6r&mode=gun&encryption=none&fp=chrome&headerType=None&security=reality&pbk=vOTUFJoSCYLV8WGvi_Wdy1v9oc9ICy43pzBzeRLRJSQ&sid=74247c95bc2c#Falcon_REALITY</code>\n


  <b>👤 پروفایل کاربری شما جهت مشاهده همه اطلاعات مورد نیاز</b>

  👀 https://my.thesubnet.online/9MwC4h5OjqMr41MCOFCf/${uuid}/

  <b>⚠️ این لینک را حتماً بدون فیلترشکن باز کنید</b>


  -------------------------------------------------


  <b>🔆 آموزش اتصال</b>

  لطفاً نرم‌افزار خودتون رو اپدیت کنید و کانفیگ‌‌های جدیدتون رو استفاده کنید ☝🏼

  <b>📲 کاربران iOS</b>

  اگر iOS شما بالای ۱۶ هست  از اپ اول در غیر این صورت از اپ دوم استفاده کنید:

  
  🏎 FoXray (iOS +16)
  🍎 https://apps.apple.com/app/foxray/id6448898396
  
  🦊 آموزش راه اندازی FoXray
  🖇 https://t.me/falcon_net/43

  📦 V2Box
  🍏 https://apps.apple.com/us/app/v2box-v2ray-client/id6446814690

  📲 آموزش راه اندازی V2Box
  🖇 https://t.me/falcon_net/54

  
  <b>🤖 کاربران Android</b>

  🍋 https://play.google.com/store/apps/details?id=com.v2ray.ang

  ⏬ https://github.com/2dust/v2rayNG/releases/download/1.8.5/v2rayNG_1.8.5.apk

  💢 آموزش راه اندازی v2rayNG
  🛎 https://t.me/falcon_net/10

  <b>🖥 آموزش و کلاینت کاربران دسکتاپ</b>

  🖇 https://t.me/falcon_net/64

  `;
  bot
    .sendMessage(userId, configsMessage, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: mainMenu,
    })
    .then(() => {
      userPosition[userId] = null;
    });
}

function startCommand(userId) {
  bot.sendMessage(userId, "خوش آمدید 🌹", {
    reply_markup: mainMenu,
  });
}

const sendHiddifyBot = (userId, uuid) => {
  const hiddifyBotMessage = `
  <b>🤖 ربات مشاهده وضعیت بسته</b>


  🔮 برای استفاده از این ربات کافیه روی لینک اختصاصی خودتون کلیک کنید و در صفحه ربات گزینه START را فشار بدید.


  🖇 tg://resolve?domain=my_falcon_hiddify_bot&start=${uuid}

  
  ☝️ از این به بعد هم هر موقع خواستید وضعیت بسته‌تون رو دوباره چک کنید، وارد چت ربات بشید و روی دکمه update زیر پیام مصرف‌تون بزنید.
  `;

  bot
    .sendMessage(userId, hiddifyBotMessage, {
      parse_mode: "HTML",
      reply_markup: mainMenu,
    })
    .then(() => {
      userPosition[userId] = null;
    });
};

parseMessage = (userId, messageText) => {
  switch (messageText) {
    case commands.start:
      startCommand(userId);
      break;
    case commands.configs:
      userPosition[userId] = commands.configs;
      sendUuid(userId);
      break;
    case commands.hiddifyBot:
      userPosition[userId] = commands.hiddifyBot;
      sendUuid(userId);
      break;
    default:
      if (userPosition[userId] == commands.configs) {
        sendConfigsMessage(userId, messageText);
      } else if (userPosition[userId] == commands.hiddifyBot) {
        sendHiddifyBot(userId, messageText);
      } else {
        wrongMessage(userId);
      }
  }
};

bot.on("message", (msg) => {
  const userId = msg.from.id;
  const messageText = msg.text;

  parseMessage(userId, messageText);
});

bot.on("polling_error", (err) => {
  console.log(err);
});
