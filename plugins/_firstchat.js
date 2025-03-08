import moment from 'moment-timezone'
export async function all(m) {

    if (m.chat.endsWith('broadcast')) return
    if (m.fromMe) return
    if (m.isGroup) return
    if (db.data.settings.groupOnly) return
let user = global.db.data.users[m.sender]
    let { banned } = db.data.users[m.chat]
    let username = conn.getName(m.sender) 
    const fswtag = { key: {  fromMe: false, participant: "0@s.whatsapp.net", ...(m.chat ? { remoteJid: "status@broadcast" } : {}) }, message: { groupStatusMentionMessage: { message: { protocolMessage: { key: m.key,  type: 25 }}}}};
    
   if (new Date - user.pc < 86400000) return // setiap 24 jam sekali
//await conn.modifyChat(m.chat, 'mute', -Math.floor(new Date / 1e3) * 1e3 - 1e3).catch(console.log)
let capt = `Hai ${ucapan()}

${banned ? `kamu *terbanned* kak 😕\nHubungi: wa.me/${owner[0]}` : 'Ada Yang Bisa Saya Bantu?'}
`.trim()
await this.sendMessage(
  m.chat,
  {
      text: capt, //Additional information
      title: "Hai kak selamat datang kembali, aku Binzu!",
      subtitle: "This is are welcome text",
      footer: "Binzu Bot",
      interactiveButtons: [
           {
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                   display_text: "Sewa Bot",
                   id: ".sewa"
              })
           },
           {
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                   display_text: "Group Bot",
                   id: ".grupbot"
              })  
           },
           {
              name: "cta_url",
              buttonParamsJson: JSON.stringify({
                   display_text: "Group Bot",
                   url: "https://chat.whatsapp.com/KPqLnY91cX2BGWaZVcXX2D"
              })
           }
      ]
  },
{
  quoted : fswtag
}
) 
//  await this.sendButton(m.chat, `
// Hai ${ucapan()}

// ${banned ? `kamu *terbanned* kak 😕\nHubungi: wa.me/${owner[0]}` : 'Ada Yang Bisa Saya Bantu?'}
// `.trim(), `Klik menu di bawah untuk melihat menu bot`, null, [['Sewa Bot', '/sewa'], ['group', '.grupbot']], m)
    user.pc = new Date * 1
}
let messk = [['Menu','.allmenu'], ['Donate', '.donate']]
//await this.sendButtons

function ucapan() {
        const hour_now = moment.tz('Asia/Jakarta').format('HH')
        var ucapanWaktu = 'Pagi kak'
        if (hour_now >= '03' && hour_now <= '10') {
          ucapanWaktu = 'Pagi kak'
        } else if (hour_now >= '10' && hour_now <= '15') {
          ucapanWaktu = 'Siang kak'
        } else if (hour_now >= '15' && hour_now <= '17') {
          ucapanWaktu = 'Sore kak'
        } else if (hour_now >= '17' && hour_now <= '18') {
          ucapanWaktu = 'Selamat Petang kak'
        } else if (hour_now >= '18' && hour_now <= '23') {
          ucapanWaktu = 'Malam kak'
        } else {
          ucapanWaktu = 'Selamat Malam!'
        }	
        return ucapanWaktu
}