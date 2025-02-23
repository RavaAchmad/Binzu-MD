let handler = async (m, { conn, usedPrefix: _p, __dirname, args }) => {
   conn.relayMessage(m.chat, {
       requestPaymentMessage: {
         currencyCodeIso4217: 'IDR',
         amount1000: 999999 * 1000,
         requestFrom: m.sender,
         noteMessage: {
           extendedTextMessage: {
             text: `*This bot was created by me with the purpose of learning and having fun and not intending to harm others.*
   
   want to buy source code? please chat owner
   @${global.owner.split("@")[0]}
   m`,
             contextInfo: {
               mentionedJid: [global.owner],
               externalAdReply: {
                 showAdAttribution: true
               }
             }
           }
         }
       }
     }, {})
   }
   handler.help = ['sc', 'sourcecode']
   handler.tags = ['info','main']
   handler.command = /^(sc|script|sourcecode)$/i
   handler.register = false
   
   export default handler