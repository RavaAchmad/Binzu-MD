import axios from 'axios';
import cheerio from 'cheerio';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  const inputError = '[!] *Input salah*\n\nContoh: ${usedPrefix + command} 1';
  if (!text || isNaN(text)) return await conn.reply(m.chat, inputError, m);

  const surahIndex = parseInt(text);
  try {
    const result = await getSurah(surahIndex);
    await conn.reply(m.chat, result, m);
  } catch (error) {
    await conn.reply(m.chat, `Error: ${error.message}`, m);
  }
};

const selectSurah = async (link) => {
  const { data } = await axios.get(link);
  const $ = cheerio.load(data);
  const Result = [];
  const Isi = [];

  const surah = $('body > main > article > h1').text().trim();
  const bismillah = $('body > main > article > p').text().trim();

  $('body > main > article > ol > li').each((i, e) => {
    const arabic = $(e).find('p.arabic').text().trim();
    const baca = $(e).find('p.translate').text().trim();
    const arti = $(e).find('p.meaning').text().trim();
    Isi.push({ arabic, baca, arti });
  });

  Result.push({ surah, bismillah }, Isi);
  return Result;
};

const listsurah = async () => {
  const { data } = await axios.get('https://litequran.net/');
  const $ = cheerio.load(data);
  const Result = [];

  $('body > main > ol > li').each((i, e) => {
    const name_surah = $(e).find('a').text().trim();
    const link = 'https://litequran.net/' + $(e).find('a').attr('href');
    Result.push({ link, name_surah });
  });

  return Result;
};

const getSurah = async (surahIndex) => {
  const surahList = await listsurah();
  if (surahIndex < 1 || surahIndex > surahList.length) {
    return "🚫 Nomor surah tidak valid. Silakan masukkan nomor surah yang sesuai.";
  }

  const selectedSurah = surahList[surahIndex - 1];
  const surahContent = await selectSurah(selectedSurah.link);

  let response = `🕌 *Surah ${surahContent[0].surah}*\n`;
  response += `📜 *Ayat yang penuh hikmah dan petunjuk bagi umat*:\n\n`;
  surahContent[1].forEach((ayah, index) => {
    response += `*𖦹 Ayat ${index + 1}:*\n`;
    response += `🕋 ${ayah.arabic}\n`;
    response += `📖 ${ayah.baca}\n`;
    response += `📚 ${ayah.arti}\n\n`;
  });
  response += `\n🤲 *Semoga kita selalu diberkahi oleh Allah dengan petunjuk dari ayat-ayat ini.*\n`;
  return response;
};

handler.help = ["surah"];
handler.tags = ["islamic"];
handler.command = ["surah"];

export default handler;