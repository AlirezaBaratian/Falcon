const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

const commands = {
  start: "/start",
  guide: "🗒 آموزش‌ها",
  configs: "🚀 پیام کانفیگ",
  hiddifyBot: "📶 ربات هیدیفای",
};

const mainMenuButtons = [
  [
    { text: commands.guide },
    { text: commands.configs },
    { text: commands.hiddifyBot },
  ],
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
  ℹ️ شما می‌توانید کانفیگ‌های زیر را بر اساس اپراتور اینترنت خود با لمس بر روی آن‌ها کپی و استفاده کنید.\n
  👤 این لینک‌ها برای هر کاربر منحصر به فرد هستند.\n
  <b>⚠️ در صورت به اشتراک گذاشتن آن با افراد دیگر، ترافیک استفاده شده آن‌ها برای شما محاسبه می‌شود.</b>\n
  <b>🚀 کانفیگ مستقیم با پروتکل جدید REALITY (مخصوص برنامه‌های اپدیت شده)</b>\n
  <code>vless://${uuid}@cdn.thesubnet.online:443?hiddify=1&sni=cdimage.debian.org&type=grpc&alpn=h2&path=vsAOpPEzSsvX2BCPs2RMc6r&serviceName=vsAOpPEzSsvX2BCPs2RMc6r&mode=gun&encryption=none&fp=chrome&headerType=None&security=reality&pbk=vOTUFJoSCYLV8WGvi_Wdy1v9oc9ICy43pzBzeRLRJSQ&sid=74247c95bc2c#Falcon_REALITY</code>\n
  <b>پروفایل کاربری شما جهت مشاهده میزان مصرف، مدت مانده از بسته و کانفیگ‌ها </b>\n
  https://my.thesubnet.online/9MwC4h5OjqMr41MCOFCf/${uuid}/\n
  <b>این لینک را حتماً بدون فیلترشکن باز کنید ⚠️</b>\n
  `;
  bot.sendMessage(userId, configsMessage, {
    parse_mode: "HTML",
    reply_markup: mainMenu,
  });
}

function sendGuideMessage(userId) {
  const guideMessage = `
  <b>🔆 آموزش اتصال
  لطفاً نرم‌افزار خودتون رو اپدیت کنید و کانفیگ‌‌های جدیدتون رواستفاده کنید ☝🏼</b>\n
  کاربران iOS از نرم‌افزار FoXray یا V2Box استفاده کنید:
  
  🏎 FoXray (iOS +16)
  https://apps.apple.com/app/foxray/id6448898396
  
  🦊 آموزش راه اندازی FoXray
  https://t.me/falcon_net/43


  📦 V2Box
  https://apps.apple.com/us/app/v2box-v2ray-client/id6446814690
  📲 آموزش راه اندازی V2Box
  https://t.me/falcon_net/54
  
  کاربران Android اپ v2rayNG خودتون رو از Play Store اپدیت کنید یا از لینک پایینش مستقیم دانلود کنید:

  ▶️ https://play.google.com/store/apps/details?id=com.v2ray.ang

  ⏬ https://github.com/2dust/v2rayNG/releases/download/1.8.5/v2rayNG_1.8.5.apk

  💢 آموزش راه اندازی v2rayNG
  https://t.me/falcon_net/10

  `;
  bot.sendMessage(userId, guideMessage, {
    parse_mode: "HTML",
    reply_markup: mainMenu,
  });
}

function startCommand(userId, commands) {
  bot.sendMessage(userId, "خوش آمدید 🌹", {
    reply_markup: mainMenu,
  });
}

const sendHiddifyBot = (userId, uuid) => {
  const hiddifyBotMessage = `
  <b>🤖 ربات مشاهده وضعیت بست</b>\n
  🔮 برای استفاده از این ربات کافیه روی لینک اختصاصی خودتون کلیک کنید و در صفحه ربات گزینه START را فشار بدید.\n
  \n
  🖇 tg://resolve?domain=my_falcon_hiddify_bot&start=${uuid}\n
  \n
  ☝️ از این به بعد هم هر موقع خواستید وضعیت بسته‌تون رو دوباره چک کنید، وارد چت ربات بشید و روی دکمه update زیر پیام مصرف‌تون بزنید.
  `;

  bot.sendMessage(userId, hiddifyBotMessage, {
    parse_mode: "HTML",
    reply_markup: mainMenu,
  });
};

parseMessage = (userId, messageText, messageId) => {
  switch (messageText) {
    case commands.start:
      startCommand(userId, commands);
      break;
    case commands.guide:
      sendGuideMessage(userId);
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

function isAdmin(userId) {
  const adminIds = [73860050];
  const noPermissionMessage = "⛔️ شما دسترسی لازم به این ربات را ندارید!";

  if (adminIds.includes(userId)) {
    return true;
  } else {
    bot.sendMessage(userId, noPermissionMessage);
  }
}

bot.on("message", (msg) => {
  const userId = msg.from.id;
  const messageText = msg.text;

  if (isAdmin(userId)) {
    parseMessage(userId, messageText, msg.message_id);
  }
});

bot.on("polling_error", (err) => {
  console.log(err);
});
