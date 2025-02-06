import fetch from 'node-fetch';
import api from 'btch-downloader';
import { ytdls, ddownr } from '../lib/scrape.js';

let handler = async (m, { conn, args, usedPrefix, command }) => {
	if (!(args[0] || '').match(new RegExp(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/, 'gi'))) return m.reply(`Example: *${usedPrefix}${command}* https://www.youtube.com/watch?v=K9_VFxzCuQ0`)
	await m.reply(wait);
	const startTime = Date.now();
    try {
		const response = await fetch(`https://ytdl.axeel.my.id/api/download/video/?url=${args[0]}`);
		const data = await response.json();

		if (!data || !data.metadata) {
			return m.reply('Gagal ambil data dari link YouTube itu, coba deh link-nya bener. 😕');
		}

		const {
			metadata,
			downloads
		} = data;

		const videoUrl = downloads.url;
		const thumbnailUrl = metadata.thumbnail.url;

		await conn.sendMessage(m.chat, {
			image: {
				url: thumbnailUrl
			},
			caption: `📺 *Judul*: ${metadata.title}\n⏳ *Durasi*: ${metadata.duration}s\n👀 *Views*: ${metadata.views}\n👍 *Likes*: ${metadata.likes}\n✍ *Author*: ${metadata.author}\n📜 *Deskripsi*: ${metadata.description}`,
		}, {
			quoted: m
		});

		await conn.sendMessage(m.chat, {
			video: {
				url: videoUrl
			},
			caption: `🎬 *Video*: ${metadata.title}`,
        }, {
            quoted: m
        });

    } catch (error) {
		console.log(error)
		try {
		let resp = await ytdls(args[0]);
		let tez = `Title : ${resp.result.title}\n`
		+`- File type : ${resp.result.video.fileType}\n`;
		+ `- Size : ${resp.result.video.fileSize}\n`;
		+ `- Duration : ${resp.result.duration}`
		await conn.sendMessage(m.chat, { image: { url: resp.result.image}, caption: tez}, {quoted: m})
		const endTime = Date.now();
		const executionTime = endTime - startTime;
		await conn.sendMessage(m.chat, { video: { url: resp.result.video.downloadLink}, caption: `Process : ${executionTime} Milisecond` }, { quoted: m})
		
		// let anu = await( await fetch(`https://api.betabotz.eu.org/api/download/ytmp3?url=${args[0]}&apikey=${lann}`)).json()
		// let txt = `*${anu.result.title}*\n\n`
		// + `⌲ Resolution : 360p\n`
		// + `⌲ Duration : ${anu.result.duration}`
		// await conn.sendFile(m.chat, anu.result.mp4, `${anu.result.title}.mp4`, txt, m)
	} catch (e) {
		console.log(e)
			try {
	        	console.log(e)
				let api = await ddownr.download(args[0], "720");
				console.log(api);
				let capt = `Title : ${api.title}\n`
				+`\nTunggu sebentar lagi!`
				await m.reply(capt)
				const endTime = Date.now();
				const executionTime = endTime - startTime;
				await conn.sendMessage(m.chat, { video: { url: api.downloadUrl}, caption: `Process : ${executionTime} Milisecond` }, { quoted: m})
			} catch (e) {
				console.log(e)
			}
		}
	}
}; 

handler.menudownload = ['ytvideo <url>']
handler.tagsdownload = ['downloader']
handler.command = /^(yt(v(ideo)?|mp4))$/i

handler.premium = false;
handler.limit = true;

export default handler;
