import fetch from 'node-fetch';
import uploadImage from '../lib/uploadImage.js';
import { pxpic } from '../lib/pxpic.js';

let handler = async (m, { conn, usedPrefix, command }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';
    if (/^image/.test(mime) && !/webp/.test(mime)) {
      const img = await q.download();
      const out = await uploadImage(img);
      m.reply(wait);
  try {
    const api = await pxpic.create(out, 'removebg');
    await conn.sendFile(m.chat, api.resultImageUrl, 'remini.jpg', 'Nih kak', m);
  } catch (e) {
    console.log('no bg (1) = ' + e);
    try {
      const api = await fetch(`https://api.betabotz.eu.org/api/tools/removebg?url=${out}&apikey=${lann}`);
      const image = await api.json();
      const url = image.url.result;
        conn.sendFile(m.chat, url, null, wm, m);
  } catch(e) {
    console.log('alternate (nobg) e:\n' + e)
    throw 'Server error wak'
  }
}
    } else {
      m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`);
    }
}

handler.command = handler.help = ['removebg','nobg'];
handler.tags = ['tools'];
handler.premium = false;
handler.limit = true;

export default handler