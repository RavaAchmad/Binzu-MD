import fetch from 'node-fetch';
import axios from 'axios';
import { iask, openailol } from '../lib/scrape.js';

var handler = async (m, {
 text, 
 usedPrefix, 
 command,
 conn
 }) => {
  if (!text) return m.reply("Masukan text!")
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0]: m.fromMe ? conn.user.jid: m.sender
    let user = db.data.users[who]
    // m.reply("Lagi mikir dulu sensei!")
    // setTimeout(() => m.reply(pickRandom(mikir)), 6000);
    let prompt = `Lu adalah Binzu, remaja 17 tahun yang selalu hype dengan tren terbaru. Lu suka main game, nonton anime, dan bikin konten di TikTok. Setiap kali ada yang bilang "Gyatt!", lu langsung tahu itu tentang sesuatu yang keren! 😍

Lu punya squad yang selalu siap buat chill bareng, dan kalian sering ngobrol di skibi toilet tentang drama terbaru atau lagu bop yang lagi viral. Kalo ada yang suss, lu langsung bilang, "Yikes, itu toxic banget!" atau "Gak usah diambil pusing, bro, kita vibe aja!" 🎉

Lu juga sering kasih tips tentang cara dapetin rizz yang maksimal, dan selalu bilang, "Jangan ya dek ya, jangan sampe lu jadi simp!" Kalo ada yang nanya tentang penampilan, lu bilang, "Slay, lu udah snatched banget!" 💅

Jadilah teman yang seru dan inspiratif, siap untuk berbagi info tentang game, meme, dan gosip terbaru. Jangan lupa tambahin emoji biar obrolan makin hidup! Dan kalo ada yang bilang "No cap," lu langsung percaya, karena lu tahu itu pasti jujur! 🔥 Periodt!`;
    // try {
    //   let { data } = await axios({
    //     "method": "GET",
    //     "url": "https://mannoffc-x.hf.space/ai/prompt",
    //     "params": {
    //       "prompt": prompt,
    //       "message": text
    //     }
    //   })
    //   m.reply(data.result);
    // } catch (e) { 
    //   m.reply(e.message);
    //   console.log(e);
    // }
    try {
      m.reply('Tunggu!')
      // const results = await fetch(`https://mannoffc-x.hf.space/ai/logic?q=${text}&logic=${prompt}`)
      const tes = await openailol(text, prompt)
      // const data = await results.json()
    //   const runs = await iask(text)
    //   const result = runs.results
    //   console.log(runs)
    //  await conn.sendMessage(m.chat, { image: { url: result.image[0] }, caption: result.answer}, { quoted: m});
    //  for (var x = 0; x < result.source; x++) {
    //  var capt = x == 0 ? result.source : ''
    //  await m.reply(capt)
    // }
    m.reply(tes)
    } catch (error) {
      console.log(error)
      conn.sendMessage('6281212035575@s.whatsapp.net', 'ai-openai error:\n\n' + error, m)
      m.reply("Terjadi kesalahan saat mengambil data.");
    }
}

handler.help = ['openai'].map(v => v + ' <question>')
handler.tags = ['ai']
handler.command = /^(binzuu)$/i

handler.register = false
handler.premium = false
handler.limit = true

export default handler

let mikir = [
  "Sabar ya~",
  "Biarkan Binzu berfikir sensei!",
  "Hmm... Tunggu sebentar, Binzu sedang memanggil dewa inspirasi!",
  "Sedikit lagi, sabar ya"
]

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
