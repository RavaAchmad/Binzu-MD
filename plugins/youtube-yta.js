import fetch from 'node-fetch';
import search from 'yt-search';
import { ytdls } from '../lib/scrape.js';
// import { youtube } from 'btch-downloader';
let handler = async (m, {
	conn,
	usedPrefix,
	command,
	args
}) => {
	if (!(args[0] || '').match(new RegExp(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/, 'gi'))) return m.reply(`Example: *${usedPrefix}${command}* https://youtu.be/pvlDjh_UgvA`)
		try {
				// let audioUrl;
				// try {
				// 	audioUrl = await youtube(text);
				// } catch (e) {
				// 	conn.reply(m.chat, 'Please wait...', m);
				// 	audioUrl = await youtube(text);
				// }

	
				// await conn.relayMessage(m.chat, {
				// 	extendedTextMessage: {
				// 		text: caption,
				// 		contextInfo: {
				// 			externalAdReply: {
				// 				title: convert.title,
				// 				mediaType: 1,
				// 				previewType: 0,
				// 				body: "Made by Botcahx",
				// 				renderLargerThumbnail: true,
				// 				thumbnailUrl: convert.image,
				// 				sourceUrl: audioUrl.mp3
				// 			}
				// 		},
				// 		mentions: [m.sender]
				// 	}
				// }, {});
				// const yt = await (await fetch(`https://widipe.com/download/ytdl?url=${links}`)).json()
				const yt = await ytdls(args[0])
			const aurio = yt.result.audio.downloadLink
		  //await conn.sendFile(m.chat, audioz, 'tiktok.mp3', m)
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
	   //conn.sendMessage('628121035575@s.whatsapp.net', `ner~ harap ganti cookie nya~\n\nAn error occurred while searching for the song: ${e.message}`, m);
		  m.reply('Yahhh sinyalnya error, bentar ya pake jalur alternatif dulu~ ૮ ˶ᵔ ᵕ ᵔ˶ ა');
		  const yt = await( await fetch(`https://api.betabotz.eu.org/api/download/ytmp3?url=${args[0]}&apikey=ravaja`)).json()
		await conn.sendMessage(m.chat, { audio: { url: yt.result.mp3 }, mimetype: 'audio/mpeg' }, { quoted: m });
	  }
}
handler.tags = ['downloader']
handler.help = ['ytmp3 <url>']
handler.command = /^(yt(a(udio)?|mp3))$/i

handler.register = true;
handler.limit = true;

export default handler;