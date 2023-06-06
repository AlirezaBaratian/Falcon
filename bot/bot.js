const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

const commands = {
  warningCommand: "⚠️ نمایش پیام اخطار",
  writeConfigsCommand: "🍬 ارسال پیام کانفیگ‌های کاربر",
};

const mainMenu = [
  [{ text: commands.warningCommand }, { text: commands.writeConfigsCommand }],
];

let uuid = "42175160-3d7c-4d4e-a9d1-e4704b3edbab"

wrongMessage = (userId) => {
  const wrongMessageError = "پیام ارسالی اشتباه است 🥲";
  bot.sendMessage(userId, wrongMessageError);
};

function writeConfigsMessage(userId, uuid) {
  const configsMessage = `
  <b>📑 لینک‌های اتصال</b>
  ℹ️ شما می‌توانید کانفیگ‌های زیر را بر اساس اپراتور اینترنت خود با لمس بر روی آن‌ها کپی و استفاده کنید.\n
  👤 این لینک‌ها برای هر کاربر منحصر به فرد هستند.\n
  <b>⚠️ در صورت به اشتراک گذاشتن آن با افراد دیگر، ترافیک استفاده شده آن‌ها برای شما محاسبه می‌شود.</b>\n
  <b>🚀 کانفیگ مستقیم با پروتکل جدید REALITY (مخصوص برنامه‌های اپدیت شده)</b>\n
  <code>vless://${uuid}@cdn.thesubnet.online:443?hiddify=1&sni=cdimage.debian.org&type=grpc&alpn=h2&path=vsAOpPEzSsvX2BCPs2RMc6r&serviceName=vsAOpPEzSsvX2BCPs2RMc6r&mode=gun&encryption=none&fp=chrome&headerType=None&security=reality&pbk=vOTUFJoSCYLV8WGvi_Wdy1v9oc9ICy43pzBzeRLRJSQ&sid=74247c95bc2c#Falcon_REALITY</code>\n
  <b>📼 قدیمی (سرعت و کیفیت پایین برای برنامه‌های قدیمی‌تر)</b>\n
  <code>vless://${uuid}@cdn.thesubnet.online:443?hiddify=1&sni=cdn.thesubnet.online&type=ws&alpn=http/1.1&path=/vsAOpPEzSsX6ybCJDCkV7iB6&host=cdn.thesubnet.online&encryption=none&fp=chrome&headerType=None&security=tls#Falcon_Old</code>\n
  <b>پروفایل کاربری شما جهت مشاهده میزان مصرف، مدت مانده از بسته و کانفیگ‌ها </b>\n
  https://my.thesubnet.online/9MwC4h5OjqMr41MCOFCf/${uuid}/\n
  <b>این لینک را حتماً بدون فیلترشکن باز کنید ⚠️</b>\n
  `;
  bot.sendMessage(userId, configsMessage, {
    parse_mode: "HTML",
    reply_markup: JSON.stringify({
      keyboard: mainMenu,
      is_persistent: true,
      resize_keboard: true,
      one_time_keyboard: true,
    }),
  });
}

function writeWarningMessage(userId) {
  const warningMessage = `
  <b>⚠️ اخطار: سرویس جدید اینترنت ملی راه اندازی شد و از چند ساعت دیگه کانفیگ‌های قبلی رو خاموش می‌کنم.
  لطفاً هرچه سریع‌تر نرم‌افزار خودتون رو اپدیت کنید و کانفیگ‌‌های جدیدتون رواستفاده کنید ☝🏼</b>\n
  کاربران iOS از نرم‌افزار FoXray یا V2Box استفاده کنید:
  
  🏎 FoXray (iOS +16)
  https://apps.apple.com/app/foxray/id6448898396

  📦 V2Box
  https://apps.apple.com/us/app/v2box-v2ray-client/id6446814690
  
  کاربران Android اپ v2rayNG خودتون رو از Play Store اپدیت کنید یا از لینک پایینش مستقیم دانلود کنید:

  ▶️ https://play.google.com/store/apps/details?id=com.v2ray.ang

  ⏬ https://github.com/2dust/v2rayNG/releases/download/1.8.5/v2rayNG_1.8.5.apk

  `;
  bot.sendMessage(userId, warningMessage, {
    parse_mode: "HTML",
    reply_markup: JSON.stringify({
      keyboard: mainMenu,
      is_persistent: true,
      resize_keboard: true,
      one_time_keyboard: true,
    }),
  });
}

function startCommand(userId, commands) {
  bot.sendMessage(userId, "خوش آمدید 🌹", {
    reply_markup: JSON.stringify({
      keyboard: mainMenu,
      is_persistent: true,
      resize_keboard: true,
      one_time_keyboard: true,
    }),
  });
}

parseMessage = (userId, messageText) => {
  switch (messageText) {
    case "/start":
      startCommand(userId, commands);
      break;
    case commands.warningCommand:
      writeWarningMessage(userId);
      break;
    case commands.writeConfigsCommand:
      writeConfigsMessage(userId, uuid);
      break;
    default:
      wrongMessage(userId);
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
    parseMessage(userId, messageText);
  }
});

bot.on("polling_error", (err) => {
  console.log(err);
});
