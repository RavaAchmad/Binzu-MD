import api from 'api-dylux';
import fetch from 'node-fetch';
var handler = async (m, {
	conn,
	text,
	usedPrefix,
	command
}) => {
		var teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : ''
		if (!teks) throw `Use example ${usedPrefix}${command} Indonesia raya`
		m.reply("tunggu kak lagi proses")
	try {
		var api = await ( await fetch(`https://api.botcahx.eu.org/api/search/lirik?lirik=${text}&apikey=ravaja`)).json()
		let { 
			lyrics,
			title,
			artist,
			image
		 } = api.result
		let data = `*Title :* \`${title}\`\n`
		data += `*Artist :* ${artist}\n\n`
		data += `\`LYRICS\`\n\n`
		data += lyrics.replace('\'')
		conn.sendMessage(m.chat, {
                text: data,
                contextInfo: {
                    externalAdReply: {
                        title: "Lyrics Search",
                        body: "Powered By ʙɪɴᴢᴜ",
                        thumbnailUrl: image ? image : "https://telegra.ph/file/8cc4c40b303872675f7bb.jpg",
                        sourceUrl: "",
                        mediaType: 1,
                        showAdAttribution: true,
                        renderLargerThumbnail: true
                    }
                }
            })
	} catch (e) {
		console.log(e)
		m.reply("music tidak tersedia, atau belum terdaftar dalam list. Laporkan ke owner jika emang ada yang aneh")
	}
}

handler.help = ['lirik'].map(v => v + ' name song')
handler.tags = ['internet']
handler.command = /^(lirik|lyrics|lyric)$/i
handler.limit = true

export default handler;