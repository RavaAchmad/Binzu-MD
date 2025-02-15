
export async function before(m, { conn, participants }) {

    let name = m.sender
    let fkonn = { 
        key: { 
            fromMe: false, 
            participant: '0@s.whatsapp.net', 
            ...(m.chat ? { remoteJid: '0@s.whatsapp.net' } : {}) 
        }, 
        message: { 
            contactMessage: { 
                displayName: `${await conn.getName(name)}`, 
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` 
            } 
        } 
    };

    if (!conn.owner_join) {
        conn.owner_join = {
            join: false,
            time: 0,
        };
    }

    const currentTime = Math.floor(Date.now() / 1000);

    if (!m.isGroup || conn.owner_join.time > currentTime) {
        console.log("Not a group message or still in cooldown");
        return;
    }

    let messageText = "";
    let mentionedUsers = participants.map((u) => u.id).filter((v) => v !== conn.user.jid);

    switch (m.sender) {
        case "+6281212035575@s.whatsapp.net":
            messageText = "📣 Perhatian semua 📣, Ownerku yang ganteng sudah datang!";
            break;
    }

    if (messageText) {
        await conn.sendMessage(
            m.chat,
            {
                text: messageText,
            },
            {
                quoted: fkonn,
                mentions: mentionedUsers,
            }
        );

        conn.owner_join = {
            join: true,
            time: currentTime + 600,
        };
    } else {
        console.log("No message to send");
    }
    return
}
