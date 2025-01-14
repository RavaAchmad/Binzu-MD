let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw(`Contoh:\n${usedPrefix}${command} Halo?`);
    conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
   
    let idch = '120363218308835731@newsletter'

    let who = m.sender
  let username = conn.getName(who)
  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }})
  m.reply('PESAN MU TELAH TERKIRIM SILAHKAN CEK CHANNEL ANDA')    
  let url = await conn.profilePictureUrl(who, 'image') 
  await conn.sendMessage(`${idch}`, {
  text: `${text}`,
      contextInfo: {
      externalAdReply: {
        title: `Pesan dari ${username}`,
        body: 'message to channel',
        thumbnailUrl: `${url}`,
        sourceUrl: '',
        mediaType: 1,
        renderLargerThumbnail: false, 
        showAdAttribution: true
      }}
  })}
handler.command = /^(msgch)$/i
handler.help = ['msgch']
handler.tags = ['tools']
handler.premium = false
handler.owner = true

export default handler;