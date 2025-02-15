import uploadImage from '../lib/uploadImage.js';
import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command }) => {
    m.reply('https://chat.whatsapp.com/IzdHOmj7n8gGJQhHzf3GyU')
}

handler.help = ['grupbot']
handler.tags = ['tool']
handler.command = /^((grup|group)bot)$/i
handler.private = true

export default handler