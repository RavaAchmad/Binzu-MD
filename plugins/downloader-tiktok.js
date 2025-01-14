//import axios from 'axios';
import fetch from 'node-fetch';
import axios from 'axios';

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
            var {
                data,
                code,
                msg
            } = await tiktokDl(body)
            if (code !== 0) throw msg
            if (data?.images?.length) {
                for (var x = 0; x < data.images.length; x++) {
                    var capt = x == 0 ? data.title : ''
                    await conn.sendMessage(m.chat, {
                        image: {
                            url: data.images[x]
                        },
                        caption: capt
                    }, {
                        quoted: m
                    })
                }
                await conn.sendMessage(m.chat, {         
                    audio: {
                        url: data.music
                    },
                    mimetype: 'audio/mpeg',
                    contextInfo: {
                        externalAdReply: {
                            title: 'Ini audio nya kak!',
                            body: "▶︎ Now Playing...",
                            thumbnailUrl: data.cover,
                            sourceUrl: body,
                            mediaType: 1,
                            showAdAttribution: true,
                            renderLargerThumbnail: true
                        }
                    }
                }, {
                    quoted: m
                });
            } else {
                var vid = data.play
                var descvid = `${data.title}`
                var desc = `${formatK(data.digg_count)} Likes, ${formatK(data.comment_count)} Comments. TikTok video from ${data.author.nickname} (@${data.author.unique_id}): "${data.title}". ${data.music_info.title}.`
                await conn.sendFile(m.chat, vid, '', descvid, m)
                await m.reply(desc)
            }
                await conn.sendMessage(m.chat, {         
                    audio: {
                        url: data.music
                    },
                    mimetype: 'audio/mpeg',
                    contextInfo: {
                        externalAdReply: {
                            title: 'Ini audio nya kak!',
                            body: "▶︎ Now Playing...",
                            thumbnailUrl: data.cover,
                            sourceUrl: body,
                            mediaType: 1,
                            showAdAttribution: true,
                            renderLargerThumbnail: true
                        }
                    }
                }, {
                    quoted: m
                });
        } catch (e) {
            console.log(e.message)
            delay(2000)
            m.reply("alternatif yach")
            try {
                const response = await axios.get(`https://api.botcahx.eu.org/api/dowloader/tiktok?url=${text}&apikey=${btc}`);        
                const res = response.data.result;      
                var { video, title, title_audio, audio } = res;
                let capt = `乂 *T I K T O K*\n\n`;
                capt += `◦ *Title* : ${title}\n`;
                capt += `◦ *Audio* : ${title_audio}\n`;
                capt += `\n`;        
                await conn.sendFile(m.chat, video, null, capt, m);
                conn.sendMessage(m.chat, { audio: { url: audio[0] }, mimetype: 'audio/mpeg' }, { quoted: m });     
            }catch(e) {
                console.log(e)
            }
        };
    };
    handler.help = ['tiktok']
    handler.tags = ['downloader'];
    handler.command = ['tiktok', 'ttdl', 'tt'];
    handler.xmaze = true;
    export default handler
    async function tiktokDl(url) {
        var xzn = await fetch(API('xzn', 'api/tiktok', {
            url
        }, 'apikey'))
        var wtf = xzn.json();
        return wtf
    }
    
    function formatK(num) {
        return new Intl.NumberFormat('en-US', {
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(num)
    }