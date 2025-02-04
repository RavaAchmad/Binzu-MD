let badwordRegex = /as(u|w)|anj(k|g)|ajn?(g|k)|dongo|a?njin(g|k)|bajingan|b(a?n)?gsa?t|(k|d)o?nto?l|me?me?(k|q|g|w)|pe?pe?(k|q)|meki|titi(t|d)|pe?ler|tetek|toket|ngewe|go?blo?k|to?lo?l|idiot|(k|ng)e?nto?(t|d)|jembut|bego|dajj?al|janc(u|o)k|pantek|puki ?(mak)?|kimak|kampang|lonte|col(i|mek?)|pelacur|henceu?t|nigga|fuck|dick|bitch|tits|bastard|asshole|dick|pussy/i // tambahin sendiri
export async function before(m, { isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return 
    let chat = global.db.data.chats[m.chat]
    let user = global.db.data.users[m.sender]
    let isBadword = badwordRegex.exec(m.text)
    let hapus = m.key.participant
    let bang = m.key.id
    if (chat.antiBadword && isBadword && m.isGroup) {
        user.warn += 1
        await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: hapus }})
//          conn.reply(`${user.warning >= 5 ? '*📮 Warning Kamu Sudah Mencapai 5!*' : '*📮 Kata Kata Toxic Terdeteksi*'}

// [❗] Jika *${global.info.namebot}* sudah memperingatkanmu sebanyak 5x. Kamu akan dikeluarkan dari group ini.

// “ Tch... Diam kamu bocah brengsek ! ! !`)
        conn.reply(m.chat, `Maaf Kak, *${global.info.namebot}* ditugaskan untuk memoderasi konten di grup ini dan Kamu telah melakukan kesalahan, sehingga *${global.info.namebot}* akan memberikan tindakan sesuai dengan moderasi yang diatur di sini (ᵕ—ᴗ—)
            
> Alasan : *Badword*
> Tindakan : *Delete Pesan*`)
        if (user.warn >= 5) {
            user.warn = 0
            // conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        }
    }
    return !0
}

function levenshtein(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1 // deletion
                    )
                );
            }
        }
    }

    return matrix[b.length][a.length];
}