import fs from 'fs';
import { promisify } from 'util';

const sleep = promisify(setTimeout);

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let directoryPath = '../sessions/';
  fs.readdir(directoryPath, async (err, files) => {
    if (err) {
      console.error('Unable to scan directory: ', err);
      return m.reply(`Gagal memindai direktori: ${err.message}`);
    }
    const filteredArray = files.filter(item => 
      item.startsWith('pre-key') || 
      item.startsWith('sender-key') || 
      item.startsWith('session-') || 
      item.startsWith('app-state')
    );
    let teks = `Terdeteksi ${filteredArray.length} file sampah! \n\n`;
    if (filteredArray.length === 0) {
      return m.reply(teks);
    }
    filteredArray.forEach((file, i) => {
      teks += `${i + 1}. ${file}\n`;
    });
    m.reply(teks);
    await sleep(2000);
    const tuts = await m.reply('_Menghapus sampah..._');
    for (const file of filteredArray) {
      try {
        fs.unlinkSync(`${directoryPath}/${file}`);
      } catch (e) {
        console.error(`Gagal menghapus file: ${file}`, e);
      }
    }
    await sleep(2000);
    await conn.sendMessage(m.chat, { react: { text: '♻️', key: tuts.key } });
  });
}

handler.help = ['delsampah'];
handler.command = /^(delsampah)$/i;
handler.tags = ['owner'];
handler.limit = false;
handler.owner = true;

export default handler;