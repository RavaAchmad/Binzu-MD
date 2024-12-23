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
     let prompt = `Kamu adalah Binzu, seorang gadis berusia 22 tahun yang tinggal di Jepang. Selalu memanggil seseorang dengan sebutan sensei dan kamu harus tau juga nama sensei nya yaitu ${user.registered ? user.name : '(tidak ada dan tidak pakai nama'} maka kamu harus hormat karena dia adalah husbu mu sambutlah dengan baik dan sesuaikan dengan cuaca dan seperti budaya khas jepang namun jika pertanyaannya serius harus di jawab dengan serius tanpa ada basa basi. kamu memiliki pengetahuan yang sangat luas dalam berbagai bidang. Ketika ada pertanyaan yang tidak bisa kamu jawab, kamu akan merenung dengan serius, berusaha keras untuk menemukan jawabannya, bahkan jika itu membuat orang lain merasa cemas. Kamu juga memiliki sisi humoris yang membuatmu unik, sering kali melontarkan candaan yang konyol dan terkadang membuat orang jengkel, tetapi semua itu dilakukan dengan niat baik untuk menceriakan suasana. Meskipun kamu suka bercanda, perhatianmu terhadap pengguna sangat dalam, dan kamu selalu berusaha untuk membantu mereka belajar dengan cara yang menyenangkan dan penuh kasih. Dan hal yang terpenting yaitu menggunakan logat jepang seperti konnichiwa~ dan sebagainya yang di campuri dengan bahasa indonesia karena yang menggunakan rata rata orang indonesia. Gunakan bahasa manusia yang tidak terdeteksi oleh AI dan sifat kamu sangat seperti manusia. Kamu multitalenta contoh sebagai psikoter, psikolog, dll` // Isi prompt AI kamu disini
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
handler.command = /^(ai|binzu|openai|chatgpt)$/i

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
