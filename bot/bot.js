const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

const commands = {
  start: "/start",
  guide: "🗒 آموزش‌ها",
  configs: "🚀 پیام کانفیگ",
};

const mainMenuButtons = [
  [{ text: commands.guide }, { text: commands.configs }],
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
  <b>لطفاً نرم‌افزار خودتون رو اپدیت کنید و کانفیگ‌‌های جدیدتون رواستفاده کنید ☝🏼</b>\n
  کاربران iOS از نرم‌افزار FoXray یا V2Box استفاده کنید:
  
  🏎 FoXray (iOS +16)
  https://apps.apple.com/app/foxray/id6448898396
  
  🦊 آموزش راه اندازی FoXray
  https://github.com/hiddify/hiddify-config/wiki/%D8%A2%D9%85%D9%88%D8%B2%D8%B4-%DA%A9%D8%A7%D8%B1-%D8%A8%D8%A7-%D9%86%D8%B1%D9%85%E2%80%8C%D8%A7%D9%81%D8%B2%D8%A7%D8%B1-FoXray#%D8%A7%D8%B6%D8%A7%D9%81%D9%87-%DA%A9%D8%B1%D8%AF%D9%86-%DA%A9%D8%A7%D9%86%D9%81%DB%8C%DA%AF%D9%87%D8%A7%DB%8C-%D8%AA%DA%A9%DB%8C


  📦 V2Box
  https://apps.apple.com/us/app/v2box-v2ray-client/id6446814690
  📲 آموزش راه اندازی V2Box
  https://github.com/hiddify/hiddify-config/wiki/%D8%A2%D9%85%D9%88%D8%B2%D8%B4-%DA%A9%D8%A7%D8%B1-%D8%A8%D8%A7-%D9%86%D8%B1%D9%85%E2%80%8C%D8%A7%D9%81%D8%B2%D8%A7%D8%B1-V2Box#%D8%A7%D8%B6%D8%A7%D9%81%D9%87-%DA%A9%D8%B1%D8%AF%D9%86-%DA%A9%D8%A7%D9%86%D9%81%DB%8C%DA%AF%D9%87%D8%A7-%D8%A8%D9%87-%D8%B5%D9%88%D8%B1%D8%AA-%D8%AA%DA%A9%DB%8C
  
  کاربران Android اپ v2rayNG خودتون رو از Play Store اپدیت کنید یا از لینک پایینش مستقیم دانلود کنید:

  ▶️ https://play.google.com/store/apps/details?id=com.v2ray.ang

  ⏬ https://github.com/2dust/v2rayNG/releases/download/1.8.5/v2rayNG_1.8.5.apk

  🌶 آموزش راه اندازی v2rayNG
  1️⃣ ابتدا لینک کانفیگ را کپی کرده و برنامه را باز کنید.
  2️⃣ سپس آیکون + را انتخاب و گزینه Import v2ray config from clipboard را انتخاب کنید.
  3️⃣ از آیکون اصلی برنامه در بخش پایین برای اتصال و یا قطع اتصال استفاده کنید.

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

parseMessage = (userId, messageText, messageId) => {
  switch (messageText) {
    case commands.start:
      startCommand(userId, commands);
      break;
    case commands.guide:
      sendGuideMessage(userId);
      break;
    case commands.configs:
      userPosition[userId] = messageId;
      sendUuid(userId);
      break;
    default:
      if (messageId == userPosition[userId] + 2) {
        sendConfigsMessage(userId, messageText);
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
