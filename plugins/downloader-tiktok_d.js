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
        switch (command) {
            case 'ttv':
                        try {
                            const response = await axios.get(`https://api.botcahx.eu.org/api/dowloader/tiktok?url=${text}&apikey=${btc}`);        
                            const res = await response.data.result;
                            if (res) {     
                                var { video, title, title_audio, audio } = res;
                                
                                const videoUrl = Array.isArray(video) ? video[0] : video;
                                if (!videoUrl) {
                                    return m.reply('❌ Error: No valid video URL found');
                                }

                                try {
                                    const videoCheck = await axios.head(videoUrl);
                                    const contentType = videoCheck.headers['content-type'];
                                    
                                    if (!contentType || !(contentType.includes('video/') || contentType.includes('application/octet-stream'))) {
                                        return m.reply('❌ Error: Invalid video content');
                                    }
                                } catch (verifyError) {
                                    return m.reply('❌ Error: Failed to verify video content');
                                }

                                let capt = `乂 *T I K T O K*\n\n`;
                                capt += `◦ *Title* : ${title || 'No Title'}\n`;
                                capt += `◦ *Audio* : ${title_audio || 'No Audio Title'}\n\n`;
                                
                                await conn.sendFile(m.chat, videoUrl, null, capt, m);
                                if (audio && audio[0]) {
                                    conn.sendMessage(m.chat, { audio: { url: audio[0] }, mimetype: 'audio/mpeg' }, { quoted: m });
                                }
                            }
                        } catch(e) {
                            console.log(e);
                            m.reply('❌ Error: Failed to process TikTok download');
                        }
            break;
            case 'tta':
                try {
                                const json = await fetch(`http://kinchan.sytes.net/tiktok/downloader?url=${args[0]}`, {
                                    method: 'GET',
                                });
                                const data = await json.json();
                                const { audio, image } = data;
                                await conn.sendMessage(m.chat, {
                                    audio: { url: audio }
                                }, { quoted: m });
                            } catch (e) {
                                m.reply('❌ Error: Failed to process TikTok audio download');
                            }
            break;
        }
    }
    
    handler.command = ['ttv', 'tta'];
    handler.xmaze = true;
    export default handler
    
    function formatK(num) {
        return new Intl.NumberFormat('en-US', {
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(num)
    }
