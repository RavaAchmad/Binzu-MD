/* 
 * XM4ZE 
 * https://github.com/XM4ZE
 */

import { downloadFromYoutube, ytdls, ddownr } from '../lib/scrape.js';
import search from 'yt-search';

const handler = async (m, { conn, text }) => {
    if (!text) return m.reply('*example*: .play eula song');
    if (text.startsWith('https://')) {
        return m.reply(`Silahkan gunakan \`.ytmp3 atau .yta\` untuk mendapatkan audio`);
    }

    const results = await search(text);
    const video = results.videos[0];

    if (!video) {
        return m.reply('Video tidak ditemukan.');
    }

    const { videoId, timestamp: durasi, author, views, url: links, title, seconds: detik } = video;
    const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

    const infoText = `  ◦ *Duration*: ${durasi}
  ◦ *Author*: ${author.name}
  ◦ *Views*: ${views}

SEARCH By 
- github.com/talmobi/yt-search

SENT By 
- ${global.info.namebot}`;

    await conn.sendMessage(m.chat, {
        text: infoText,
        contextInfo: {
            forwardingScore: 9999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.info.channel,
                serverMessageId: null,
                newsletterName: global.info.namechannel,
            },
            externalAdReply: {
                title: "AUDIO SEDANG DI KIRIM",
                body: `Youtube Play by Assisten ${global.info.namebot}`,
                thumbnailUrl,
                sourceUrl: links,
                mediaType: 1,
                renderLargerThumbnail: true
            },
        },
    }, {});

    const button = [['MP4', `.ytv ${links}`]];
    await conn.sendButton(m.chat, `Mau sekalian video nya?`, `Click button MP4`, global.maximus, button, m);

    if (detik > 900) {
        return m.reply(`Audio *${durasi}*\n_Tidak dapat mengirim, maksimal durasi 15 Menit_`);
    }

    try {
        const us = await ytdls(links);
        const hasil = await us.result.audio.downloadLink;
        console.log(us);
        await conn.sendMessage(m.chat, {
            audio: {
                url: hasil
            },
            mimetype: 'audio/mpeg'
        }, {
            quoted: m
        });
    } catch (e) {
        console.error(e);
        m.reply("panggil owner atau teruskan pesan ini ke nomornya" + e.message);
        m.reply("Tunggu sebentar sedang mencoba alternatif kedua!")
        try {
            let apik = await ddownr.download("mp3", links)
            let hasil = await apik.downloadUrl
            console.log(hasil);
            await conn.sendMessage(m.chat, {
                audio: {
                    url: hasil
                },
                mimetype: 'audio/mpeg'
            }, {
                quoted: m
            });
        } catch(e) {
            m.reply(e.message)
        }
    }
};

handler.help = ['youtubeplay'].map(v => v + ' name/url');
handler.tags = ['downloader'];
handler.command = /^(ytplay|play|youtubeplay|song|music)$/i;
handler.limit = true;
handler.register = true;

export default handler;
