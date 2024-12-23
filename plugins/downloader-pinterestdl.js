import fetch from 'node-fetch';
import { search } from 'pinterest-dl';
let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) throw "Masukan Query!! contoh: .pinterest2 itsuki nakano"
  try {
    const data = await search(text);
    //const rand = pickRandom(data);
    console.log(data)
    let push = [];
    for (let x of data.sort(() => Math.random() - 0.5)) {
    await push.push(['*Title:* ' + text + '\n*Made by:* love <3' || 'Untitled', global.wm, '', x, []])
}
    //console.log(rand)
  //let res = await (await fetch(`https://skizo.tech/api/pinterest?apikey=ravaja&search=${text}`)).json()
//if (res.status !== true) throw 'not found'
  //await m.reply(`Sedang Mengirim *${res.result.length}* GAMBAR dan akan di kirim ke private chat `)
  //for (let imgs of data) {   
let ban = m.mentionedJid[0] || m.sender || conn.parseMention(args[0]) || (args[0].replace(/[@.+-]/g, '').replace(' ', '') + '@s.whatsapp.net') || ''
await conn.sendButtonSlide(m.chat, `*Search of ${data.length} Result*`, '', push, m)
} catch(e){
  console.log(e)
  m.reply(e.message)
}
//await conn.sendFile(m.chat, rand, 'hweee.jpg', null)
  //}
}
handler.help = ["pinterest"]
handler.limit = true
handler.tags = ["downloader"]
handler.command = ["pin","pinterest"]

export default handler

function pickRandom(list) {
    return list[Math.floor(list.length * Math.random())]
}