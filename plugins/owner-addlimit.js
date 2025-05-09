let handler = async (m, { conn, command, text, args }) => {
    if (!text) throw 'Berapa Limit?'
    let who
    if (m.isGroup) who = m.mentionedJid[0]
    else who = args[0] ? args[0].replace(/@/g, '') + '@s.whatsapp.net' : m.sender
    if (!args[1]) throw 'Berapa Limit?'
    if (!who) throw 'Tag??'
    let users = global.db.data.users
    users[who].limit += args[1]
    conn.sendMessage(who, {
        text: `Limit kamu bertampah ${args[1]}! Terimakasih sudah memakai Binzu. Janganlupa beritahu owner kami ya ^~^`,
        mentions: [who]
    }, { quoted: m })
    conn.reply(m.chat, 'Sukses', m)
}
handler.help = ['addlimit']
handler.tags = ['owner']
handler.command = /^addlimit(user)?$/i
handler.rowner = true

export default handler