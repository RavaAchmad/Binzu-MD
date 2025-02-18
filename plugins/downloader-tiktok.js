//import axios from 'axios';
import fetch from 'node-fetch';
import axios from 'axios';
import { LoveTik } from '../lib/scrape';

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
        try {
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
        };
    };
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