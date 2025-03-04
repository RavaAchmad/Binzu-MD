let handler = async (m, { text, isAdmin }) => {
  try {
    if (!m || !m.sender) return
    let user = global.db.data.users[m.sender]
    if (!user) {
      global.db.data.users[m.sender] = {}
      user = global.db.data.users[m.sender]
    }
    
    const msg = `*Pengguna* ${conn.getName(m.sender)} *Sedang AFK*\n*Alasan:* ${text ? ' ' + text : 'tanpa alasan'}\n\nSelamat berkegiatan! Jangan lupa untuk menonaktifkan AFK jika sudah kembali <3`
    
    await m.reply(msg)
    user.afk = + new Date
    user.afkReason = text
  } catch (err) {
    console.error('Error in AFK handler:', err)
    m.reply('Terjadi error saat mengatur status AFK')
  }
};
handler.help = ['afk <alasan>']
handler.tags = ['group']
handler.command = /^afk$/i
handler.group = true
handler.admin = false

export default handler