import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {  
        if (!args[0]) throw `Gunakan contoh ${usedPrefix}${command} https://fb.watch/mcx9K6cb6t/?mibextid=8103lRmnirLUhozF`;
        try {
        const response = await fetch(`https://api.botcahx.eu.org/api/dowloader/fbdown3?url=${link}&apikey=${btc}`);
        const data = await response.json();
        const urls = data.result.url.urls;
        const liimit = global.db.data.users[m.sender].limit

        if (Array.isArray(urls)) {
            for (let url of urls) {
                if (url.sd) {
                    await conn.sendFile(m.chat, url.sd, 'fb.mp4', `*Facebook Downloader*`, m);
                    break;
                }
            }
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