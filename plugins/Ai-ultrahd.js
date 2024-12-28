import uploadFile from '../lib/uploadFile.js';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

let handler = async (m, {
    conn,
    usedPrefix,
    command
}) => {
    //if (!owner) return 'fitur sedang error, gunakan fitur lain!'
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';
    if (/^image/.test(mime) && !/webp/.test(mime)) {
        const img = await q.download();
        console.log(img)
        const out = await uploadFile(img);
        m.reply(wait);
                    try {
                        const api = await fetch(`https://api.botcahx.eu.org/api/tools/remini?url=${out}&apikey=${btc}`);
                        const image = await api.json();
                        const {
                            url
                        } = image;
                        conn.sendFile(m.chat, url, null, wm, m);
                    } catch (e) {
                        console.log(e);
                        m.reply(eror)
                    }
    } else {
        m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau reply gambar yang sudah dikirim.`);
    }
}

handler.help = ['hdr']
handler.command = ["hdr"];
handler.tags = ['ai'];
handler.register = true;
handler.limit = true;

export default handler