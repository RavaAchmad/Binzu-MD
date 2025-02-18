import fetch from 'node-fetch'
/**
 * @type {import('@adiwajshing/baileys')}
 */
const { getBinaryNodeChild, getBinaryNodeChildren, generateWAMessageFromContent, proto, getContentType, delay, getDevice} = (await import('@adiwajshing/baileys')).default
let handler = async (m, { conn, text, participants, usedPrefix, command }) => {
// CASE ADD BY BERBAGI FITUR
//LINK SUMBER: https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
//~ Convert to case by Rim, [Delete WM DIA GW GA TANGGUNG JAWAB]
//

    if (!text && !m.quoted) {
        return m.reply(`Reply pengguna/masukkan nomor, contoh:\n${usedPrefix + command} +628xxx`);
    }

    let link = await conn.groupInviteCode(m.chat).catch(() => null);
    if (!link) return m.reply("⚠ Error: Tidak bisa mendapatkan kode undangan grup.");

    let metadata = await conn.groupMetadata(m.chat).catch(() => null);
    if (!metadata) return m.reply("⚠ Error: Gagal mendapatkan informasi grup.");

    let groupName = metadata.subject;
    let existingParticipants = metadata.participants.map(user => user.id);
    let inputNumbers = [];

    if (m.quoted) {
        inputNumbers.push(m.quoted.sender.split('@')[0]);
    }

    if (text) {
        inputNumbers = inputNumbers.concat(
            text.split(',')
                .map(v => v.replace(/[^0-9]/g, ''))
                .filter(v => v.length > 4 && v.length < 20)
        );
    }

    inputNumbers = [...new Set(inputNumbers)];

    for (const number of inputNumbers) {
        const jid = `${number}@s.whatsapp.net`;

        if (existingParticipants.includes(jid)) {
            await m.reply(`⚠ Pengguna @${number} sudah ada di grup.`);
            continue;
        }

        const exists = await conn.onWhatsApp(jid);
        if (!exists[0]?.exists) {
            await m.reply(`⚠ Pengguna @${number} tidak terdaftar di WhatsApp.`);
            continue;
        }

        try {
            const response = await conn.query({
                tag: 'iq',
                attrs: {
                    type: 'set',
                    xmlns: 'w:g2',
                    to: m.chat,
                },
                content: [{
                    tag: 'add',
                    attrs: {},
                    content: [{
                        tag: 'participant',
                        attrs: { jid },
                    }],
                }],
            });

            const participant = getBinaryNodeChildren(response, 'add');
            const user = participant[0]?.content.find(item => item.attrs.jid === jid);

            if (user?.attrs.error === '421') {
                m.reply("⚠ Tidak dapat menambahkan pengguna tersebut. Mereka telah membatasi undangan ke grup.");
                continue;
            }

            if (user?.attrs.error === '408') {
                await m.reply(`✅ Undangan grup berhasil dikirim ke @${number} karena pengguna baru saja keluar dari grup.`);
                await conn.sendMessage(
                    jid, {
                        text: `✨ Anda diundang kembali ke grup ini:\nhttps://chat.whatsapp.com/${link}`,
                        contextInfo: {
                            externalAdReply: {
                                title: groupName,
                                body: null,
                                thumbnailUrl: await conn.profilePictureUrl(m.chat, 'image').catch(() => null),
                                sourceUrl: `https://chat.whatsapp.com/${link}`,
                                mediaType: 1,
                                renderLargerThumbnail: false,
                            },
                        },
                    }, { quoted: null }
                );
                continue;
            }

            if (user?.attrs.error === '403') {
                await m.reply(`Mengirim tautan ke @${number}.`);
                const content = getBinaryNodeChild(user, 'add_request');
                const { code, expiration } = content.attrs;
                const pp = await conn.profilePictureUrl(m.chat, 'image').catch(() => null);
                const jpegThumbnail = pp ? await fetch(pp).then(res => res.buffer()) : Buffer.alloc(0);

                const msgs = generateWAMessageFromContent(
                    m.chat,
                    proto.Message.fromObject({
                        groupInviteMessage: {
                            groupJid: m.chat,
                            inviteCode: code,
                            inviteExpiration: parseInt(expiration),
                            groupName: groupName,
                            jpegThumbnail: jpegThumbnail,
                            caption: "Undangan untuk bersetubuhan badan.",
                        },
                    }), {
                        userJid: conn.user.id,
                    }
                );

                await conn.sendMessage(jid, {
                    forward: msgs,
                    mentions: [jid]
                });
            }
        } catch (err) {
            console.error(err);
            await m.reply(`Error saat menambahkan @${number}: ${err.message}`);
        }
    }
}
handler.help = ['add', '+'].map(v => v + ' nomor')
handler.tags = ['group']
handler.command = /^(add|menambahkan|\+)$/i
handler.group = true
handler.rowner = false
handler.botAdmin = true
handler.admin = true
handler.fail = null

export default handler