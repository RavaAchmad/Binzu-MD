/* 
 * XM4ZE 
 * https://github.com/XM4ZE
 */
import moment from 'moment-timezone'
import {
        youtubedl
} from '@bochilteam/scraper';
import {
        toAudio
} from '../lib/converter.js'
import api from 'btch-downloader';
import search from 'yt-search';
import fetch from 'node-fetch';
import ytdl from 'ytdl-core';
import fs from 'fs';

let handler = async (m, {
        conn,
        text
}) => {
        if (!text) return m.reply('*example*: .play eula song');
        if (text.startsWith('https://')) return m.reply(`Silahkan gunakan \`.ytmp3 atau .yta\` untuk mendapatkan audio`)
        let results = await search(text);
        if (!results.videos || results.videos.length === 0) {
                return m.reply('No results found for the given query.');
        }
        let videoId = results.videos[0].videoId;
        let durasi = results.videos[0].timestamp;
        let thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
        let author = results.videos[0].author.name;
        let views = results.videos[0].views;
        let links = results.videos[0].url;
        let title = results.videos[0].title
        let detik = results.videos[0].seconds

// Do not change below
        let infoText = `  ◦ *Duration*: ${durasi}
  ◦ *Author*: ${author}
  ◦ *Views*: ${views}
  
SEARCH By 
- github.com/talmobi/yt-search

SENT By 
- ${global.info.namebot}`;

        var pesan = await conn.sendMessage(m.chat, {
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
                                title: "INFORMATION",
                                body: `Youtube Play by Assisten ${global.info.namebot}`,
                                thumbnailUrl: thumbnailUrl,
                                sourceUrl: links,
                                mediaType: 1,
                                renderLargerThumbnail: true
                        },
                },
        }, {});
        await delay(3000)
                await conn.sendButton(m.chat, `Hai ${ucapan()}\n\nMonggo dipilih?`.trim(), `Klik menu di bawah untuk memilih video/audio`, null, [['MP4', `/ytv ${links}`], ['MP3', `/yta ${links}`]], m)

        // if (detik > 900) return m.reply(`Audio *${durasi}*\n_Tidak dapat mengirim, maksimal durasi 15 Menit_`);
        //         try {
        //                 const yt = await (await fetch(`https://api.betabotz.eu.org/api/download/ytmp3?url=${links}&apikey=${lann}`)).json()
        //                console.log(yt)
        //                 m.reply('sebentar lagi kak, audio sedang dikirim...')
        //                 await conn.sendMessage(m.chat, {
        //                         audio: {
        //                                 url: yt.result.mp3
        //                         },
        //                         mimetype: 'audio/mpeg'
        //                 }, {
        //                         quoted: m
        //                 });
        //                 try {
        //                         await conn.sendButton(m.chat, `Hai ${ucapan()}\n\nSekalian dengan video nya?`.trim(), `Klik menu di bawah untuk memilih video`, null, [['MP4', `/ytv ${links}`]], m)
        //                 } catch (e) {
        //                         console.log(e);
        //                         m.reply('An error occurred while sending the button message.');
        //                 }
        //         } catch (e) {
        //                 console.log('betabotz emror = ' +e);
        //                 try {
        //                         let btch = await (await fetch(`https://api.botcahx.eu.org/api/dowloader/yt?url=${links}&apikey=${btc}`)).json()
        //                         await conn.sendMessage(m.chat, {
        //                                 audio: {
        //                                         url: btch.result.mp3
        //                                 },
        //                                 mimetype: 'audio/mpeg'
        //                         }, {
        //                                 quoted: m
        //                         });
        //                         try {
        //                                 await conn.sendButton(m.chat, `Hai ${ucapan()}\n\nSekalian dengan video nya?`.trim(), `Klik menu di bawah untuk memilih video`, null, [['MP4', `/ytv ${links}`]], m)
        //                         } catch (e) {
        //                                 console.log(e);
        //                                 m.reply('An error occurred while sending the button message.');
        //                         }
        //                 } catch (e) {
        //                         console.log(e)
        //                         try {
        //                                 let boc = await youtubedl(links)
        //                                 m.reply('sebentar lagi kak, audio sedang dikirim')
        //                                 let mx = await boc.audio['128kbps'].download()
        //                                 await conn.sendMessage(m.chat, {
        //                                         audio: {
        //                                                 url: mx
        //                                         },
        //                                         mimetype: 'audio/mpeg'
        //                                 }, {
        //                                         quoted: m
        //                                 });
        //                                 try {
        //                                         await conn.sendButton(m.chat, `Hai ${ucapan()}\n\nSekalian dengan video nya?`.trim(), `Klik menu di bawah untuk memilih video`, null, [['MP4', `/ytv ${links}`]], m)
        //                                 } catch (e) {
        //                                         console.log(e);
        //                                         m.reply('An error occurred while sending the button message.');
        //                                 }
        //                         } catch (e) {
        //                                 console.log(e)
        //                                 m.reply(`An error occurred while searching for the song: ${e}`);
        //                         }
        //                 }
        // }
};


handler.help = ['youtubeplay'].map(v => v + ' name/url');
handler.tags = ['downloader'];
handler.command = /^(ytplay|play|youtubeplay|song|music)$/i;
handler.limit = true;
handler.register = true;

export default handler;

function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

function ucapan() {
        const hour_now = moment.tz('Asia/Jakarta').format('HH')
        var ucapanWaktu = 'Pagi kak'
        if (hour_now >= '03' && hour_now <= '10') {
          ucapanWaktu = 'Pagi kak'
        } else if (hour_now >= '10' && hour_now <= '15') {
          ucapanWaktu = 'Siang kak'
        } else if (hour_now >= '15' && hour_now <= '17') {
          ucapanWaktu = 'Sore kak'
        } else if (hour_now >= '17' && hour_now <= '18') {
          ucapanWaktu = 'Selamat Petang kak'
        } else if (hour_now >= '18' && hour_now <= '23') {
          ucapanWaktu = 'Malam kak'
        } else {
          ucapanWaktu = 'Selamat Malam!'
        }	
        return ucapanWaktu
}