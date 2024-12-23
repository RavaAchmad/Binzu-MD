
import { areJidsSameUser, getDevice } from '@adiwajshing/baileys';
import fetch from 'node-fetch';

let handler = async (m, { conn, args, command }) => {
    let user = global.db.data.users[m.sender]
    let wmpp = 'https://i.ibb.co.com/ZJYNS79/images-q-tbn-ANd9-Gc-Qu-Umf-XV5-LHNju-Td8me-GKa-CMs6-P0kx-I3x-MJEg-s.jpg'
    let gc = "120363163174172117@g.us"
    let troli = { key: { remoteJid: 'status@broadcast', participant: '0@s.whatsapp.net' }, message: { orderMessage: { itemCount: 9999999999999999999999999999999999999999999999999999999, status: 1, surface: 1, message: wm, orderTitle: wm, sellerJid: '0@s.whatsapp.net' } } }
    if (!/all/.test(command) && await getDevice(m.key.id) == 'android') {
        await conn.sendButton(gc, 'Pencet Tombol *Salin / Copy*', wm, wmpp, [['Salin / Copy', 'Si rasya kenapa jir','cta_copy']], troli)
    } else conn.sendMessage(m.chat, 'si atmin kenapa jir', troli)
}
handler.command = /^iseng$/i
handler.owner = true

export default handler