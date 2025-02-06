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
		var res = await fetch(`https://api.botcahx.eu.org/api/dowloader/yt?url=${args[0]}&apikey=ravaja`)
		m.reply("pemroses!")
			var json = await res.json()
			console.log("response : " + json)
			var { title, thumb, mp3} = json.result
			await conn.sendMessage(m.chat, {         
				audio: {
					url: mp3
				},
				mimetype: 'audio/mpeg',
				contextInfo: {
					externalAdReply: {
						title: title,
						body: "▶︎ Now Playing...",
						thumbnailUrl: thumb,
						sourceUrl: args[0],
						mediaType: 1,
						showAdAttribution: true,
						renderLargerThumbnail: true
					}
				}
			}, {
				quoted: m
			});

		} catch(e) {
		
			conn.reply(m.chat, 'Sedang mengirim permintaan...', m);
		
			let res = await fetch(`https://ytdownloader.nvlgroup.my.id/info?url=${args[0]}`);
			if (!res.ok) return conn.reply(m.chat, 'Gagal mengambil informasi video', m);
		
			let info = await res.json();
			let title = info.title;
			let duration = info.duration || 'Tidak diketahui';
		
			let downloadUrl = `https://ytdownloader.nvlgroup.my.id/audio?url=${args[0]}&bitrate=128`;
			let audioRes = await fetch(downloadUrl);
			if (!audioRes.ok) return conn.reply(m.chat, 'Gagal mengunduh audio', m);
		
			let audioBuffer = await audioRes.buffer();
			let audioSize = audioBuffer.length / (1024 * 1024);
		
			let message = `
		[YTMP3 DOWNLOADER]
		🎵 Judul: ${title}
		🔗 Link: [Listen Here](${args[0]})
		⏱ Durasi: ${duration} menit
		📦 Besar File: ${audioSize.toFixed(2)} MB
		`;
		
			await conn.reply(m.chat, message, m);
		
			// Update status to success
			conn.reply(m.chat, 'Permintaan sukses dikirim', m);
		
			if (audioSize > 100) {
				await conn.sendMessage(m.chat, {
					document: audioBuffer,
					mimetype: 'audio/mpeg',
					fileName: `${title}.mp3`
				});
			} else {
				await conn.sendMessage(m.chat, {
					audio: audioBuffer,
					mimetype: "audio/mpeg",
					ptt: true // This sets the audio as a voice note (PTT)
				}, {
					quoted: m
				});
			}
		
			console.log(e)
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
}
handler.tags = ['downloader']
handler.help = ['ytmp3 <url>']
handler.command = /^(yt(a(udio)?|mp3))$/i

handler.register = true;
handler.limit = true;

export default handler;