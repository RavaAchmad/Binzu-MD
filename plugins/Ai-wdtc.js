import { wdtc } from '../lib/scrape.js';

var handler = async (m, {
 text,
 }) => {
  if (!text) return m.reply("Masukan text!")
    try {
        const api = await wdtc.check(text)
        m.reply(data)
    } catch(e) {
        console.log(e)
    }
  }

  handler.help = ['wdtc'].map(v => v + ' <code>')
handler.tags = ['ai']
handler.command = /^(wdtc)$/i

handler.register = false
handler.premium = false
handler.limit = true

export default handler