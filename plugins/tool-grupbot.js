import uploadImage from '../lib/uploadImage.js';
import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command }) => {
    m.reply('https://chat.whatsapp.com/KPqLnY91cX2BGWaZVcXX2D')
}

handler.help = ['grupbot']
handler.tags = ['tool']
handler.command = /^((grup|group)bot)$/i


export default handler