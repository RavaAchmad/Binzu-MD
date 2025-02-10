import pkg from 'lodash';
const { delay } = pkg;
import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {  
    if (!args[0]) throw `Gunakan contoh ${usedPrefix}${command} https://fb.watch/mcx9K6cb6t/?mibextid=8103lRmnirLUhozF`;
    try {
        const response = await fetch(`https://api.botcahx.eu.org/api/dowloader/allin?url=${args[0]}&apikey=${btc}`);
        const data = await response.json();
        const limit = global.db.data.users[m.sender].limit;

        // Extract all HD URLs
        const hdMedias = data.result.medias.filter(media => media.quality === 'hd');
        if (hdMedias.length > 0) {
            for (const hdMedia of hdMedias) {
                delay(1500);
                await conn.sendMessage(m.chat, `Here is your HD video URL: ${hdMedia.url}`, m);
            }
        } else {
            throw 'HD video not available';
        }

    } catch (error) {
        console.log(error);
        throw `${global.eror}`;
    }
}
handler.help = ['facebook'].map(v => v + ' <url>');
handler.command = /^(fb|facebook|facebookdl|fbdl|fbdown|dlfb)$/i;
handler.tags = ['downloader'];
handler.limit = true;
handler.group = false;
handler.premium = false;
handler.owner = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;
handler.private = false;

export default handler