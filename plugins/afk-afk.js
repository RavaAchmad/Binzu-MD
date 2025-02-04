let handler = async (m, { text, isAdmin }) => {
  let user = global.db.data.users[m.sender]
  if (isAdmin) {
  m.reply(`
*Admin* ${conn.getName(m.sender)} *Sedang AFK*
*Alasan:* ${text ? ' ' + text : 'tanpa alasan'}

Jangan lupa kembali pls ya sayangku Admin❤️
`)
user.afk = + new Date
user.afkReason = text
} else {
  m.reply(`
*Pengguna* ${conn.getName(m.sender)} *Sedang AFK*
 *Alasan:* ${text ? ' ' + text : 'tanpa alasan'}
 
 woi pl3r jangan kelamaan afk penuh memori gw
    `)
    user.afk = + new Date
    user.afkReason = text
};
}
handler.help = ['afk <alasan>']
handler.tags = ['group']
handler.command = /^afk$/i
handler.group = true
handler.admin = false

export default handler