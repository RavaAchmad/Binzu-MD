import uploadFile from '../lib/uploadFile.js';
import { remini, venchance } from '../lib/scrape.js';
import fetch from 'node-fetch';
// import waifu2x from 'waifu2x';
import fs from 'fs';
import path from 'path';

let handler = async (m, {
	conn,
	usedPrefix,
	command
}) => {
	if (!owner) return 'fitur sedang error, gunakan fitur lain!'
	const q = m.quoted ? m.quoted : m;
	const mime = (q.msg || q).mimetype || q.mediaType || '';
	if (/^image/.test(mime) && !/webp/.test(mime)) {
		const img = await q.download();
		console.log(img)
		const out = await uploadFile(img);
		m.reply(wait);
			try {
				const api = await fetch(`https://api.botcahx.eu.org/api/tools/remini-v3?url=${out}&resolusi=4&apikey=ravaja`);
				const image = await api.json();
				const {
					url
				} = image;
				await conn.sendFile(m.chat, url, null, wm, m);
			} catch (e) {
				console.log(e)
				m.reply('alternate 1')
				try {
					const api = await fetch(`https://api.botcahx.eu.org/api/tools/remini-v4?url=${out}&resolusi=16&apikey=${btc}`);
					const image = await api.json();
					const url = image.url;
					conn.sendFile(m.chat, url, null, wm, m);
				} catch (e) {
					console.log(e)
					m.reply('alternate 2')
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

async function remini(url) {
	var xzn = await fetch(API('xzn', 'api/remini', {
		url
	}, 'apikey'))
	var wtf = xzn.json();
	return wtf
}