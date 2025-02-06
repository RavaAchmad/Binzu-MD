import moment from 'moment-timezone'
export async function all(m) {

    if (m.chat.endsWith('broadcast')) return
    if (m.fromMe) return
    if (m.isGroup) return
    if (db.data.settings.groupOnly) return
let user = global.db.data.users[m.sender]
    let { banned } = db.data.users[m.chat]
    let username = conn.getName(m.sender) 
   if (new Date - user.pc < 86400000) return // setiap 24 jam sekali
//await conn.modifyChat(m.chat, 'mute', -Math.floor(new Date / 1e3) * 1e3 - 1e3).catch(console.log)
//let capt = 
 await this.sendButton(m.chat, `
Hai ${ucapan()}

${banned ? `kamu *terbanned* kak 😕\nHubungi: wa.me/${owner[0]}` : 'Ada Yang Bisa Saya Bantu?'}
`.trim(), `Klik menu di bawah untuk melihat menu bot`, null, [['Sewa Bot', '/sewa'], ['group', '.grupbot']], m)
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