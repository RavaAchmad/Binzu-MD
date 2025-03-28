export async function before(m, { conn, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return true
    if (m.mtype !== "groupStatusMentionMessage") return true
    if (isBotAdmin) {
  await m.reply("*Terdeteksi melakukan penyebutan status dalam grup ini*")
      await conn.sendMessage(m.chat, { delete: m.key })
    } else {
      await m.reply("*`Mentions Group Detect!!`*\n\n- bot bukan admin, tidak dapat menghapus pesan!!!")
    }
  
    return false
  }