let handler = async (m, { text, isAdmin }) => {
  if (!m || !m.sender || typeof m.sender !== 'string') {
    console.error('Invalid message sender:', m);
    return m.reply('Error: Invalid sender.');
  }
  let user = global.db.data.users[m.sender];
  m.reply(`
*Pengguna* ${conn.getName(m.sender)} *Sedang AFK*
 *Alasan:* ${text ? ' ' + text : 'tanpa alasan'}
 
 Selamat berkegiatan! Jangan lupa untuk menonaktifkan AFK jika sudah kembali <3
    `);
  user.afk = + new Date;
  user.afkReason = text;
    console.log(user)
};
handler.help = ['afk <alasan>'];
handler.tags = ['group'];
handler.command = /^afk$/i;
handler.group = true;
handler.admin = false;

export default handler;