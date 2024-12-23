import { Sticker } from 'wa-sticker-formatter'
    import fs from 'fs'

    var handler = async (m, {
     conn, 
     args, 
     text, 
     usedPrefix, 
     command
     }) => {
        text = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.quoted && m.quoted.caption ? m.quoted.caption : m.quoted && m.quoted.description ? m.quoted.description : ''
        if (!text) throw `Example : ${usedPrefix + command} Lagi Ruwet`
        const res = `https://api.botcahx.eu.org/api/maker/brat?text=${encodeURIComponent(text.substring(0, 151))}&apikey=${btc}`
        //var error = fs.readFileSync(`./tmp/emror.webp`)
        try {
            if (command == 'brat') {
                var stiker = await createSticker(res, false, '', '')
                await conn.sendFile(m.chat, stiker, 'emror.webp', '', m)
            }
        } catch (e) {
            console.log(e)
            m.reply(e)
            //await conn.sendFile(m.chat, error, 'error.webp', '', m)
        }
    }
    
    handler.command = handler.help = ['brat']
    handler.tags = ['sticker']
    handler.limit = true
    export default handler

    async function createSticker(res, url, packName, authorName, quality) {
        let stickerMetadata = {
            type: 'full',
            pack: stickpack,
            author: stickauth,
            quality
        }
    return (new Sticker(res ? res: error, stickerMetadata)).toBuffer()
    }