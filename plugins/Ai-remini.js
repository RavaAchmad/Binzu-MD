import uploadFile from '../lib/uploadFile.js';
import { remini } from '../lib/scrape.js';
import fetch from 'node-fetch';
// import waifu2x from 'waifu2x';
import fs from 'fs';
import path from 'path';

let handler = async (m, {
	conn,
	usedPrefix,
	command
}) => {
	const q = m.quoted ? m.quoted : m;
	const mime = (q.msg || q).mimetype || q.mediaType || '';
	if (/^image/.test(mime) && !/webp/.test(mime)) {
		const img = await q.download();
		const out = await uploadFile(img);
		m.reply(wait);
		try {
			const api = await remini(out)
			await conn.sendFile(m.chat, api, null, wm, m)
		} catch (e) {
			console.log(e)
			m.reply('menggunakan alternatif')
			try {
				const api = await fetch(`https://api.betabotz.eu.org/api/tools/remini?url=${out}&apikey=${global.lann}`);
				const image = await api.json();
				const {
					url
				} = image;
				await conn.sendFile(m.chat, url, null, wm, m);
			} catch (e) {
				console.log(e)
				try {
					const api = await fetch(`https://api.botcahx.eu.org/api/tools/remini-v3?url=${out}&resolusi=4&apikey=${btc}`);
					const image = await api.json();
					const url = image.url;
					conn.sendFile(m.chat, url, null, wm, m);
				} catch (e) {
					console.log(e)
					try {
						const api = await fetch(`https://api.botcahx.eu.org/api/tools/remini?url=${out}&apikey=${btc}`);
						const image = await api.json();
						const {
							url
						} = image;
						conn.sendFile(m.chat, url, null, wm, m);
					} catch (e) {
						console.log(e);
						m.reply(eror)
					}
				}
			}
		}
	} else {
		m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau reply gambar yang sudah dikirim.`);
	}
}

handler.help = ['hd', 'remini', 'hdr']
handler.command = ["remini", "hdr", "hd"];
handler.tags = ['ai'];
handler.register = true;
handler.limit = true;

export default handler