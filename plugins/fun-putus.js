let handler = async (m, { conn, text, usedPrefix }) => {
  if(isNaN(text)) {
    var number = text.split`@`[1]
  } else if(!isNaN(text)) {
    var number = text
  }

  if(!text && !m.quoted) return conn.reply(m.chat, `Berikan nomor, tag atau reply chat target.`, m)
  if(isNaN(number)) return conn.reply(m.chat, `Nomor tidak valid.`, m)

  try {
    if(text) {
      var user = number + '@s.whatsapp.net'
    } else if(m.quoted.sender) {
      var user = m.quoted.sender
    } else if(m.mentionedJid) {
      var user = number + '@s.whatsapp.net'
    }
  } catch (e) {
  } finally {
    let sender = m.sender
    if (!global.db.data.users[sender].pasangan) 
      return conn.reply(m.chat, `Kamu tidak memiliki pasangan.`, m)
    
    if (global.db.data.users[sender].pasangan != user)
      return conn.reply(m.chat, `Kamu hanya bisa memutuskan hubungan dengan @${global.db.data.users[sender].pasangan.split('@')[0]}`, m, {
        contextInfo: {
          mentionedJid: [global.db.data.users[sender].pasangan]
        }
      })
    
    if (global.db.data.users[sender].putusRequest == user) {
      global.db.data.users[sender].pasangan = ""
      global.db.data.users[user].pasangan = ""
      global.db.data.users[sender].putusRequest = ""
      global.db.data.users[user].putusRequest = ""
      
      conn.reply(m.chat, `Kalian telah resmi putus hubungan 💔\n\n@${sender.split('@')[0]} & @${user.split('@')[0]}`, m, {
        contextInfo: {
          mentionedJid: [sender, user]
        }
      })
    } else if (global.db.data.users[user].putusRequest == sender) {
      global.db.data.users[sender].putusRequest = user
      conn.reply(m.chat, `Kamu menyetujui permintaan putus dari @${user.split('@')[0]}\n\nKetik ${usedPrefix}putus @${user.split('@')[0]} untuk konfirmasi`, m, {
        contextInfo: {
          mentionedJid: [user]
        }
      })
    } else {
      global.db.data.users[sender].putusRequest = user
      conn.reply(m.chat, `Kamu mengajukan permintaan putus kepada @${user.split('@')[0]}\n\nTunggu dia menyetujui dengan mengetik ${usedPrefix}putus @${sender.split('@')[0]}`, m, {
        contextInfo: {
          mentionedJid: [user]
        }
      })
    }
  }
}

handler.help = ['putus @tag']
handler.tags = ['jadian']
handler.command = /^(putus)$/i
handler.group = true
handler.fail = null
export default handler
