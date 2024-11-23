// Get environment variables
import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })
// Dependencies
import Telegraf from 'telegraf'
import textToPicture = require('text-to-picture')

const bot = new Telegraf(process.env.TOKEN)
const ownerId = parseInt(process.env.ADMIN, 10)

const stickerSetName = 'asderefdxz'

bot.start(async (ctx) => {
  try {
    const botUsername = ctx.me;
    const stickerId = await getStickerId(); // Получаем ID вашей картинки
    await ctx.telegram.createNewStickerSet(
        ownerId,
        `${stickerSetName}_by_${botUsername}`,
    'PHP sucked for this many seconds',
        {
          png_sticker: stickerId,
          emojis: '💩',
          mask_position: undefined,
        }
    );
    const stickerSet = await bot.telegram.getStickerSet(
        `${stickerSetName}_by_${botUsername}`
    );
    const sticker = stickerSet.stickers[0];
    return ctx.replyWithSticker(sticker.file_id);
  } catch (err) {
    return ctx.reply(err.message);
  }
});


setInterval(updateSticker,  60 * 1000)

async function updateSticker() {
  const botUsername = bot.options.username;
  const stickerSetFullName = `${stickerSetName}_by_${botUsername}`;

  let stickerSet;

  try {
    stickerSet = await bot.telegram.getStickerSet(stickerSetFullName);


    console.log(stickerSet);
  } catch (err) {
    console.log('набор пуст, хз че делать. мб ещё раз пересоздавать сам набор');
    const stickerId = await getStickerId();
    await bot.telegram.createNewStickerSet(
        ownerId,
        stickerSetFullName,
        'PHP Stats Sticker Set',
        {
          png_sticker: stickerId,
          emojis: '💩',mask_position: undefined,
        },

    );

    stickerSet = await bot.telegram.getStickerSet(stickerSetFullName);
    console.log("New sticker set created:", stickerSet);
  }

  if (stickerSet.stickers && stickerSet.stickers.length > 0) {
    const sticker = stickerSet.stickers[0];

    console.log(sticker.file_id);

    await bot.telegram.deleteStickerFromSet(sticker.file_id);
  }

  const newStickerId = await getStickerId();
  await bot.telegram.addStickerToSet(ownerId, stickerSetFullName, {
    png_sticker: newStickerId,
    emojis: '💩',
        mask_position: undefined,
      },
      false
  )

}



/*async function updateSticker() {
  console.log('Updating stickers')
  const botUsername = bot.options.username
  const stickerSet = await bot.telegram.getStickerSet(
      `${stickerSetName}_by_${botUsername}`
  )
  const sticker = stickerSet.stickers[0]
  await bot.telegram.deleteStickerFromSet(sticker.file_id)
  await bot.telegram.addStickerToSet(
      ownerId,
      stickerSetName,
      {
        png_sticker: await getStickerId(),
        emojis: '💩',
        mask_position: undefined,
      },
      false
  )
  console.log('Updated stickers')
}*/

async function getStickerId() {
    // Получаем текущее время
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0'); // Часы в формате 2 цифр
    const minutes = now.getMinutes().toString().padStart(2, '0'); // Минуты в формате 2 цифр

    const timeString = `${hours}:${minutes}`; // Форматируем время как "часы:минуты"

    // Создаем картинку с текстом текущего времени
    const result = await textToPicture.convert({
        text: timeString,
        source: {
            width: 512,
            height: 512,
            background: '0xFF0000FF', // Фон — синий
        },
        color: 'white', // Цвет текста
        font: '64px Arial', // Шрифт и размер текста
    });

    // Загружаем стикер в Telegram
    const file = await bot.telegram.uploadStickerFile(ownerId, {
        source: await result.getBuffer(),
    });

    return file.file_id;
}

/*async function getStickerId() {
  const secondsAfterPHP = Math.floor(
      new Date().getTime() / 1000 - new Date('1995').getTime() / 1000
  )
  const result = await textToPicture.convert({
    text: `${secondsAfterPHP}`,
    source: {
      width: 512,
      height: 512,
      background: '0xFF0000FF',
    },
    color: 'white',
  })
  const file = await bot.telegram.uploadStickerFile(ownerId, {
    source: await result.getBuffer(),
  })
  return file.file_id
}*/

bot.launch().then(() => console.log("It's alive!"))
