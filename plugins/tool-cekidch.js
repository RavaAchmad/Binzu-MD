const { generateWAMessageFromContent, proto } = (await import('@adiwajshing/baileys')).default;

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Masukkan link channel\nContoh: *${usedPrefix + command}* https://whatsapp.com/channel/0029VaIulMyHbFV4zujwRv2S`);
  if (!text.includes("https://whatsapp.com/channel/")) return m.reply("Ups, harap masukkan URL Channel yang valid")

  m.react("⌛");
  
  let result = text.split('https://whatsapp.com/channel/')[1]
  let res = await conn.newsletterMetadata("invite", result)
  
  let teks = `
Berikut adalah hasil dari informasi channel kamu:
  
> ID: ${res.id}
> Nama: ${res.name}
> Followers: ${res.subscribers}
> Status: ${res.state}
> Verified: ${res.verification == "VERIFIED" ? "Terverifikasi" : "Tidak"}
  `.trim();
  let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
        message: {
            "messageContextInfo": {
                "deviceListMetadata": {},
                "deviceListMetadataVersion": 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({
                    text: teks
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: info.wm
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                    title: "",
                    subtitle: "",
                    hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [
                        {
                          "name": "cta_copy",
                          "buttonParamsJson": {"display_text": "Copy ID","copy_code": "${res.id}"}
                        },
                    ], 
                })
            })
        }
    }
  }, {})
  await conn.relayMessage(msg.key.remoteJid, msg.message, {
    messageId: msg.key.id
  })
}

handler.help = ['cekidch']
handler.tags = ['tools']
handler.command = /^(cekidch)$/i

export default handler