import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command, text }) => {
    if (!args[0]) throw `*Contoh:* ${usedPrefix}${command} https://www.instagram.com/p/ByxKbUSnubS/?utm_source=ig_web_copy_link`

	if (!text) throw 'Perihal Apah?'
	var url = text.replace(/\s+/g, '+')
		try {
			const api = await fetch(`https://api.botcahx.eu.org/api/dowloader/igdowloader?url=${args[0]}&apikey=${btc}`)
			const res = await api.json()

			
			let urlCount = new Map();
			const filteredResults = [];
			for (let item of res.result) {
				let count = urlCount.get(item.url) || 0;
				if (count < 2) {
					filteredResults.push(item);
					urlCount.set(item.url, count + 1);
				}
			}

			const limitnya = 999;
			for (let i = 0; i < Math.min(limitnya, filteredResults.length); i++) {
				await sleep(3000);
				conn.sendFile(m.chat, filteredResults[i].url, null, `*Instagram Downloader*`, m)
			}
		} catch (e) {
			m.reply('Server Error!');
			console.log(e)
		}
	}


handler.help = ['instagram'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^(ig|instagram|igdl|instagramdl|igstroy)$/i
handler.limit = true
handler.admin = true
export default handler

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}