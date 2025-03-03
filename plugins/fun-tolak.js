let handler = async (m, { conn, text }) => {
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
    
    // Check if target actually sent a proposal
    if(global.db.data.users[user].pasangan != sender) {
      return conn.reply(m.chat, `@${user.split('@')[0]} tidak sedang menembak anda`, m, {
        contextInfo: {
          mentionedJid: [user]
        }
      })
    }
    
    // Clear proposer's data if they have no partner
    if(global.db.data.users[user].pasangan === sender && !global.db.data.users[sender].pasangan) {
      global.db.data.users[user].pasangan = ""
      
      // Send rejection message
      conn.reply(m.chat, `@${sender.split('@')[0]} menolak untuk berpacaran dengan @${user.split('@')[0]} 💔`, m, {
        contextInfo: {
          mentionedJid: [sender, user]
        }
      })
      
      // Send private message to rejected user
      conn.sendMessage(user, {
        text: `@${sender.split('@')[0]} menolak untuk berpacaran dengan kamu 💔`,
        mentions: [sender]
      })
    }
  }
}

handler.help = ['tolak @tag']
handler.tags = ['jadian']
handler.command = /^(tolak)$/i
handler.group = true
handler.fail = null
export default handler
