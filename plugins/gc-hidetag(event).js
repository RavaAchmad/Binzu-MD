let { generateWAMessageFromContent } = (await import('@adiwajshing/baileys')).default

let handler = async (m, { conn, text, usedPrefix, command, participants }) => {
	
	let q = m.quoted ? m.quoted : m
	let mime = (q.msg || q).mimetype || q.mediaType || ''
	text = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.quoted && m.quoted.caption ? m.quoted.caption : m.quoted && m.quoted.description ? m.quoted.description : ''
	if (/video/g.test(mime)) {
	    if (!text) throw `Example : ${usedPrefix + command} text\n\nReply ( image, video, sticker ) jika mau menggunakannya sebagai pemanis dalam pengumuman`
		let media = await q.download?.()
		conn.sendMessage(m.chat, { video: media, caption: text, mentions: participants.map(a => a.id) }, { quoted: m })
	} else if (/image/g.test(mime)) {
	    if (!text) throw `Example : ${usedPrefix + command} text\n\nReply ( image, video, sticker ) jika mau menggunakannya sebagai pemanis dalam pengumuman`
		let media = await q.download?.()
		conn.sendMessage(m.chat, { image: media, caption: text, mentions: participants.map(a => a.id) }, { quoted: m })
    } else if (/audio/g.test(mime)) {
		let media = await q.download?.()
		conn.sendMessage(m.chat, { audio: media, mimetype: 'audio/mpeg', mentions: participants.map(a => a.id) }, { quoted: m });
	} else {
	    if (!text) throw `Example : ${usedPrefix + command} text\n\nReply ( image, video, sticker ) jika mau menggunakannya sebagai pemanis dalam pengumuman`
		await conn.sendMessage(m.chat, { text: text, mentions: participants.map(a => a.id), contextInfo: {
            businessMessageForwardInfo: {
                businessOwnerJid: conn.user.jid
            },
            isForwarded: true,
            forwardingScore: 256,
			externalAdReply: {
            title: `E-Sport BROADCAST!`,
            body: "CLASSMEETING 2024",
            thumbnailUrl: 'https://i.ibb.co.com/mXhs7YR/Banner-Class-Meet-2024.png',
            sourceUrl: "https://classsachie.crd.co",
            mediaType: 1,
            renderLargerThumbnail: true
              }} })
	} 
}

handler.help = ['hidetag'].map(v => v + ' <teks>')
handler.tags = ['adminry']
handler.command = /^(hidetags|hts)$/i

handler.admin = true

export default handler