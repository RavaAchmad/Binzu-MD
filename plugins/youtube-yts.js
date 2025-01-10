import yts from 'yt-search';
let timeout = 5000
let handler = async (m, { conn, text, usedPrefix, command }) => {
  conn.ytss = conn.ytss ? conn.ytss: {}
  let id = 'yts-' + m.chat
let data = (await yts(text)).all
let hasil = data[~~(Math.random() * data.length)]
let url = `${hasil.image}`
 let caption = '';
    caption += `∘ Judul : ${hasil.title}\n`;
    caption += `∘ Ext : Search\n`;
    caption += `∘ ID : ${hasil.videoId}\n`;
    caption += `∘ Durasi : ${hasil.timestamp}\n`;
    caption += `∘ Penonton : ${hasil.views}\n`;
    caption += `∘ Diunggah : ${hasil.ago}\n`;
    caption += `∘ Channel : ${hasil.author.url}\n`;
    caption += `∘ Url : ${hasil.url}\n`;
    caption += `∘ Thumbnail : ${hasil.image}`;
// conn.sendMessage(m.key.remoteJid, {
// image: { url: url },
// caption: caption, 
// footer: 'Binzu - bot',
// buttons: [
//   { buttonId: `.ytv ${hasil.url}`, buttonText: { displayText: `Download Video` }, type: 1 },
//   { buttonId: `.yta ${hasil.url}`, buttonText: { displayText: `Download Audio` }, type: 1 },
//   { buttonId: `.yts ${text}`, buttonText: { displayText: 'Next Search' }, type: 1 }
// ],
// headerType: 1,
// viewOnce: false
// }, { quoted: m })
conn.ytss[id] = [
  await conn.sendMessage(m.chat, { image: { url: url }, fileName: 'yts.jpg', mimetype: 'image/jpeg', caption: caption }, { quoted: m }),
  hasil,
  setTimeout(() => {
      delete conn.ytss[id]
  }, timeout)
]
}
handler.help = ['yts']
handler.tags = ['search']
handler.command = /^(yts|ytsearch|youtubesearch)$/i
handler.limit = true
handler.register = true
handler.game = true
export default handler