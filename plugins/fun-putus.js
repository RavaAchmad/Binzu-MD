let handler = async (m, { conn, usedPrefix }) => {
  try {
    // ...existing code...
    let sender = m.sender;
    let pasangan = global.db.data.users[sender].pasangan;
    
    if (!pasangan || pasangan === "") {
      return conn.reply(m.chat, "Kamu tidak memiliki pasangan.", m);
    }
    if (!global.db.data.users[pasangan]) {
      return conn.reply(m.chat, "Partner tidak terdaftar di database.", m);
    }
    
    global.db.data.users[sender].pasangan = "";
    global.db.data.users[pasangan].pasangan = "";
    
    await m.reply(`yahh padahal cocok bersama @${pasangan.split('@')[0]}.`);
    await new Promise(resolve => setTimeout(resolve, 4000)); 

    conn.reply(m.chat, `Kamu telah putus dengan @${pasangan.split('@')[0]}.`, m, { contextInfo: { mentionedJid: [pasangan] } });
    await new Promise(resolve => setTimeout(resolve, 4000));

    conn.sendMessage(pasangan, { text: `@${sender.split('@')[0]} telah memutus hubungan. Hubungan kalian telah dihapus.` }, { quoted: m, contextInfo: { mentionedJid: [sender] } });
  } catch (e) {
    conn.reply(m.chat, "Terjadi kesalahan.", m);
  }
}
handler.help = ["putus"].map(v => v + " @tag")
handler.tags = ["jadian"]
handler.command = /^putus$/i
handler.group = true
handler.limit = false
export default handler
