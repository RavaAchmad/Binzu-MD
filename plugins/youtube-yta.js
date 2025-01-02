import fetch from 'node-fetch';
import search from 'yt-search';
import { ytdls, ddownr } from '../lib/scrape.js';
// import { youtube } from 'btch-downloader';
let handler = async (m, {
	conn,
	usedPrefix,
	command,
	args
}) => {
	if (!(args[0] || '').match(new RegExp(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/, 'gi'))) return m.reply(`Example: *${usedPrefix}${command}* https://youtu.be/pvlDjh_UgvA`)
		try {
				const yt = await ytdls(args[0])
			const aurio = yt.result.audio.downloadLink
			  await conn.sendMessage(m.chat, {         
					audio: {
						url: aurio
					},
					mimetype: 'audio/mpeg',
					contextInfo: {
						externalAdReply: {
							title: "Silahkan audionya kak",
							body: "▶︎ Now Playing...",
							thumbnailUrl: global.maximus,
							sourceUrl: args[0],
							mediaType: 1,
							showAdAttribution: true,
							renderLargerThumbnail: true
						}
					}
				}, {
					quoted: m
				});
			
	  } catch (e) {
		console.log(e);
		  m.reply('Yahhh sinyalnya error, bentar ya pake jalur alternatif dulu~ ૮ ˶ᵔ ᵕ ᵔ˶ ა');
		  let api = await ddownr.download(args[0], "mp3");
		await conn.sendMessage(m.chat, { audio: { url: api.downloadUrl }, mimetype: 'audio/mpeg' }, { quoted: m });
	  }
}
handler.tags = ['downloader']
handler.help = ['ytmp3 <url>']
handler.command = /^(yt(a(udio)?|mp3))$/i

handler.register = true;
handler.limit = true;

export default handler;