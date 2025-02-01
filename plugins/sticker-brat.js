import { Sticker } from 'wa-sticker-formatter';
    import fs from 'fs';
import fetch from 'node-fetch';
    var handler = async (m, {
     conn, 
     args, 
     text, 
     usedPrefix, 
     command
     }) => {
        text = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.quoted && m.quoted.caption ? m.quoted.caption : m.quoted && m.quoted.description ? m.quoted.description : ''
        if (!text) throw `Example : ${usedPrefix + command} Lagi Ruwet`
        if (text.endsWith('--gif')) {
            const { execSync } = require('child_process')
            if (!text) return m.reply(`Contoh: ${prefix+command} halo saya rava`)
            if (text.length > 40) return m.reply(`Karakter terbatas, max 40 huruf character!`)
            const words = text.split(" ")
            const tempDir = path.join(process.cwd(), 'lib')
            if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)
            const framePaths = []
            try {
                for (let i = 0; i < words.length; i++) {
                const currentText = words.slice(0, i + 1).join(" ")
                const res = await axios.get(
                    `https://brat.caliphdev.com/api/brat?text=${encodeURIComponent(currentText)}`,
                    { responseType: "arraybuffer" }
                ).catch((e) => e.response)
                const framePath = path.join(tempDir, `frame${i}.mp4`)
                fs.writeFileSync(framePath, res.data)
                framePaths.push(framePath)
                }
                const fileListPath = path.join(tempDir, "filelist.txt")
                let fileListContent = ""
                for (let i = 0; i < framePaths.length; i++) {
                fileListContent += `file '${framePaths[i]}'\n`
                fileListContent += `duration 0.7\n`
                }
                fileListContent += `file '${framePaths[framePaths.length - 1]}'\n`
                fileListContent += `duration 2\n`
                fs.writeFileSync(fileListPath, fileListContent)
                const outputVideoPath = path.join(tempDir, "output.mp4")
                execSync(
                `ffmpeg -y -f concat -safe 0 -i ${fileListPath} -vf "fps=30" -c:v libx264 -preset ultrafast -pix_fmt yuv420p ${outputVideoPath}`
                )
                await conn.sendImageAsSticker(m.chat, outputVideoPath, m, {
                packname: global.packname,
                author: global.author
                })
                framePaths.forEach((frame) => {
                if (fs.existsSync(frame)) fs.unlinkSync(frame)
                })
                if (fs.existsSync(fileListPath)) fs.unlinkSync(fileListPath)
                if (fs.existsSync(outputVideoPath)) fs.unlinkSync(outputVideoPath)
            } catch (e) {
                console.error(e)
                m.reply('Terjadi kesalahan')
            }
            } else {
            const apis1 = `https://vapis.my.id/api/bratv1?q=${text}`
            await conn.sendImageAsSticker(m.chat, apis1, m, { packname: global.packname, author: global.author })
            }
    }
    
    handler.command = handler.help = ['brat']
    handler.tags = ['sticker']
    handler.limit = 10
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