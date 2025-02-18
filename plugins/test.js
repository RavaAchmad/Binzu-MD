import { MessageType, prepareWAMessageMedia, generateWAMessageFromContent, generateWAMessageContent } from '@adiwajshing/baileys'
let handler = async (m, {
    conn,
    text
}) => {

    await conn.sendMessage(m.chat, { react: { text: `⏱️`, key: m.key }});
    const url = "https://a.top4top.io/p_3333uv5v81.jpg";
  
    async function image(url) {
      const { imageMessage } = await generateWAMessageContent({
        image: { url }
      });
      return imageMessage;
    }
  
    let msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              body: {
                text: `Berikut daftar metode pembayaran saya ya~`
              },
              carouselMessage: {
                cards: [
                  {
                    header: proto.Message.InteractiveMessage.Header.create({
                      ...(await prepareWAMessageMedia({ image: { url: 'https://a.top4top.io/p_3333uv5v81.jpg' } })),
                      title: '',
                      gifPlayback: true,
                      subtitle: global.nameown,
                      hasMediaAttachment: false
                    }),
                    body: { text: `> Klik tombol DANA di bawah\n> DANA A/N: Ra***` },
                    nativeFlowMessage: {
                      buttons: [
                        {
                          "name": "cta_copy",
                          "buttonParamsJson": `{\"display_text\":\"Payment DANA\",\"id\":\"123456789\",\"copy_code\":\"081212035575\"}`
                        },
                      ],
                    },
                  },
                  {
                    header: proto.Message.InteractiveMessage.Header.create({
                      ...(await prepareWAMessageMedia({ image: { url: 'https://a.top4top.io/p_3333uv5v81.jpg' } })),
                      title: '',
                      gifPlayback: true,
                      subtitle: global.nameown,
                      hasMediaAttachment: false
                    }),
                    body: { text: `> Klik tombol GOPAY di bawah\n> GOPAY A/N: DEWI ASTINA` },
                    nativeFlowMessage: {
                      buttons: [
                        {
                          "name": "cta_copy",
                          "buttonParamsJson": `{\"display_text\":\"Payment GOPAY\",\"id\":\"123456789\",\"copy_code\":\"081212035575\"}`
                        },
                      ],
                    },
                  },
                  {
                    header: proto.Message.InteractiveMessage.Header.create({
                      ...(await prepareWAMessageMedia({ image: { url: 'https://i.ibb.co.com/SwkhHnb/0z-Yk-UD15-Hkm-A.jpg' } })),
                      title: '',
                      gifPlayback: true,
                      subtitle: global.nameown,
                      hasMediaAttachment: false
                    }),
                    body: { text: `> SCAN di atas / klik tombol` },
                    nativeFlowMessage: {
                      buttons: [
                        {
                          "name": "cta_url",
                          "buttonParamsJson": `{\"display_text\":\"Payment QRIS\",\"url\":\"https://i.ibb.co.com/SwkhHnb/0z-Yk-UD15-Hkm-A.jpg\",\"merchant_url\":\"https://www.google.com\"}`
                        },
                      ],
                    },
                  },
                ],
                messageVersion: 1,
              },
            },
          },
        },
      },
      { quoted: m }
    );
  
    await conn.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id,
    });

}
//handler.help = ['sewa', 'order']
//handler.tags = ['info']
handler.command = /(test)/i
handler.register = false;
handler.premium = false;

export default handler