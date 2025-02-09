import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command, text }) => {
    if (!args[0]) throw `*Contoh:* ${usedPrefix}${command} https://www.instagram.com/p/ByxKbUSnubS/?utm_source=ig_web_copy_link`

	if (!text) throw 'Perihal Apah?'
	var url = text.replace(/\s+/g, '+')
	try {
		var response = await fetch(API('xzn', 'api/ig', {
			url
		}, 'apikey'))
		var wtf = await response.json()
		for (var i of wtf) {
			await conn.sendFile(m.chat, i.url, "", "",m)
			await delay(1500)
		}
	} catch (e) {
		console.error(e)
		m.reply('Server Error! alternatif yach');
		var url = text.replace(/\s+/g, '+')
		var ig = `https://api.botcahx.eu.org/api/dowloader/igdowloader?url=${url}&apikey=ravaja`
		const res = await (await fetch(ig)).json();
		for (var i of res) {
			await conn.sendFile(m.chat, i.url, "", "",m)
			await delay(1500)
		}
	}
}

handler.help = ['instagram'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^(ig|instagram|igdl|instagramdl|igstroy)$/i
handler.limit = true

export default handler

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}