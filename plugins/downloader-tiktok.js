//import axios from 'axios';
import fetch from 'node-fetch';
import axios from 'axios';
import { LoveTik } from '../lib/scrape.js';
import { execFile } from 'child_process';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomBytes } from 'crypto';

let handler = async (m, { conn, args, usedPrefix, text, command }) => {
    var delay = time => new Promise(res => setTimeout(res, time))
    if (!args || !args[0]) throw `✳️ Contoh :\n${usedPrefix + command} https://www.tiktok.com/xxxxx`
    if (!(args[0].includes('http://') || args[0].includes('https://'))) return m.reply(`url invalid, please input a valid url. Try with add http:// or https://`)
    if (!args[0].includes('tiktok.com')) return m.reply(`Invalid Tiktok URL.`)
	
    await conn.sendMessage(m.chat, {
            react: {
                text: "⚡",
                key: m.key,
            }
        })
        var body = text.replace(/\s+/g, '+')
        const wak = await (await fetch('https://api.raolprojects.my.id/api/v2/random/ba')).buffer()

        const response = `Silahkan di pilih sesuai keinginan kak!`;

        conn.sendMessage(m.key.remoteJid, {
            image: { url: wak },
            caption: response, 
            footer: "binzu-MD",
            buttons: [
              { buttonId: `${usedPrefix}ttv ${args[0]}`, buttonText: { displayText: `Video/Gambar` }, type: 1 },
                { buttonId: `${usedPrefix}tta ${args[0]}`, buttonText: { displayText: `Audio` }, type: 1 },
            ],
            headerType: 1,
            viewOnce: true
          }, { quoted: m });

}

    handler.help = ['tiktok']
    handler.tags = ['downloader'];
    handler.command = ['tiktok', 'ttdl', 'tt'];
    handler.xmaze = true;
    export default handler
    
    function formatK(num) {
        return new Intl.NumberFormat('en-US', {
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(num)
    }

// helper function to re-encode video with ffmpeg
async function processVideo(inputUrl) {
    const outputPath = join(tmpdir(), randomBytes(6).toString('hex') + '.mp4');
    return new Promise((resolve, reject) => {
        execFile('ffmpeg', ['-i', inputUrl, '-c:v', 'libx264', '-preset', 'fast', '-f', 'mp4', outputPath, '-y'], (error) => {
            if (error) reject(error);
            else resolve(outputPath);
        });
    });
}




/*try {
    const fetchs = await fetch(`https://api.vreden.my.id/api/tiktok?url=${args[0]}`);
    const res = await fetchs.json();
    const data = res.result;
    if (Array.isArray(data.data) && data.data.some(media => media.type === 'photo')) {
        for (let x = 0; x < data.data.length; x++) {
            if (data.data[x].type === 'photo') {
                let capt = x === 0 ? data.title : '';
                await conn.sendMessage(m.chat, {
                    image: {
                        url: data.data[x].url
                    },
                    caption: capt
                }, { quoted: m });
            }
        }
        await conn.sendMessage(m.chat, {
            audio: {
                url: data.music_info.url
            },
            mimetype: 'audio/mpeg',
            contextInfo: {
                externalAdReply: {
                    title: 'Ini audio nya kak!',
                    body: "▶︎ Now Playing...",
                    thumbnailUrl: data.cover,
                    sourceUrl: args[0],
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });
    } else {
        
        const hdMedia = Array.isArray(data.data) ? data.data.filter(media => media.type === 'nowatermark_hd') : [];
        if (!hdMedia.length) throw new Error("nowatermark_hd video not found");
        const nowatermark_hd = hdMedia[0];
    
        var descvid = `${data.title}`;
        var desc = `${data.stats.likes} Likes,\n\n ${data.stats.comment} Comments.\n\n *AUTHOR:* ${data.author.nickname} (@${data.author.fullname})\n\n *TITLE:* "${data.title}". \n\n*MUSIC TITLE:* ${data.music_info.title}.`;
    
        await conn.sendFile(m.chat, nowatermark_hd.url, '', descvid, m);
    await conn.sendMessage(m.chat, {
        audio: {
            url: data.music_info.url
        },
        mimetype: 'audio/mpeg',
        contextInfo: {
            externalAdReply: {
                title: 'Ini audio nya kak!',
                body: "▶︎ Now Playing...",
                thumbnailUrl: data.cover,
                sourceUrl: args[0],
                mediaType: 1,
                showAdAttribution: true,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });
    } 

} catch(e) {
    console.log(e)
    
    try {
    
        const json = await fetch(`http://kinchan.sytes.net/tiktok/downloader?url=${args[0]}`, {
            method: 'GET',
        });
        const data = await json.json();
        const { video_hd, audio, image } = data;
        if (data.type === 'video') {
            const processedVideo = await processVideo(video_hd);
            await conn.sendFile(m.chat, processedVideo, 'kanj.mp4', '', m);
            await conn.sendMessage(m.chat, {
                audio: { url: audio }
            }, { quoted: m });
        } else if (data.type === 'slide') {
            for (let i = 0; i < image.length; i++) {
                await conn.sendFile(m.chat, image[i], '', '', m);
            }
            await conn.sendMessage(m.chat, {
                audio: { url: audio }
            }, { quoted: m });
        }
} catch (e) {
    console.log(e)
    try { 
        const result = await LoveTik.dapatkan(args[0]);
        
        if(result.images){
            const slides = await result.render();
            for (let x = 0; x < slides.length; x++) {
                    let capt = x === 0 ? data.title : 'Binzu';
                    await conn.sendMessage(m.chat, {
                        image: {
                            url: slides[x]
                        },
                        caption: capt
                    }, { quoted: m });
            }
        } else {
        console.log('Video:', result.video);
        await conn.sendFile(m.chat, result.video, '', wm, m);
        console.log('Audeo:', result.audio);
        await delay(2000)
        await conn.sendMessage(m.chat, {
            audio: {
                url: result.audio
            },
            mimetype: 'audio/mpeg',
            contextInfo: {
                externalAdReply: {
                    title: 'Ini audio nya kak!',
                    body: "▶︎ Now Playing...",
                    thumbnailUrl: global.maximus,
                    sourceUrl: args[0],
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });
    }
} catch (e) {
    console.log(e)
    await delay(2000)
    m.reply("alternatif yach")
    try {
        const response = await axios.get(`https://api.botcahx.eu.org/api/dowloader/tiktok?url=${text}&apikey=${btc}`);        
        const res = await response.data.result; 
        if (res) {     
        var { video, title, title_audio, audio } = res;
        let capt = `乂 *T I K T O K*\n\n`;
        capt += `◦ *Title* : ${title}\n`;
        capt += `◦ *Audio* : ${title_audio}\n`;
        capt += `\n`;        
        await conn.sendFile(m.chat, video, null, capt, m);
        conn.sendMessage(m.chat, { audio: { url: audio[0] }, mimetype: 'audio/mpeg' }, { quoted: m });     
    }
    }catch(e) {
        console.log(e)
    }
}
};
};*/