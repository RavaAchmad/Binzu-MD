import fetch from 'node-fetch';
import uploadImage from '../lib/uploadImage.js';
import { pxpic } from '../lib/pxpic.js';

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';
    if (/^image/.test(mime) && !/webp/.test(mime)) {
      const img = await q.download();
      const out = await uploadImage(img);
      m.reply(wait);
      const api = await fetch(`https://api.betabotz.eu.org/api/tools/removebg?url=${out}&apikey=${lann}`);
      const image = await api.json();
      const url = image.url.result;
        conn.sendFile(m.chat, url, null, wm, m);
    } else {
      m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`);
    }
  } catch (e) {
    console.error(e);
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';
    const img = await q.download();
    const out = await uploadImage(img);
    const api = await pxpic.create(out, 'removebg');
    await conn.sendFile(m.chat, api.resultImageUrl, 'remini.jpg', 'Nih kak', m);
  }
}

handler.command = handler.help = ['removebg','nobg'];
handler.tags = ['tools'];
handler.premium = false;
handler.limit = true;

export default handler