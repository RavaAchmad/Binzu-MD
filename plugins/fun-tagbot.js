import util from 'util';
import path from 'path';

let mmk = [['Menu Bot', '.allmenu']]
let cooldown = false;

const handler = async (m, { conn }) => {
  let xm4ze = await( await fetch(xmenus)).json()
  let thum = xm4ze[Math.floor(Math.random() * xm4ze.length)]
    const rawr = acak[Math.floor(Math.random() * acak.length)];
  if (cooldown) {
  await conn.sendButton(m.chat, rawr, wm, thum, mmk, m);
  }
  cooldown = true;
  setTimeout(() => {
      //m.reply('hmmm? kenapa kamu? aman?')
    cooldown = false;
  }, 20000); // 20 seconds cooldown

  const getRandomAudio = audioFiles[Math.floor(Math.random() * audioFiles.length)];
  conn.sendFile(m.chat, getRandomAudio, 'oy.mp3', null, m, true, {
    type: 'audioMessage',
    ptt: true,
  });
};

handler.customPrefix = /^(bot|Bot|ping|p|hi|hai|hey|halo|helo|hello|hi Binzu|hai Binzu|halo Binzu|helo Binzu|hello Binzu|binzu|haloo|halooo|haloooo|halooooo|oi)$/i;
handler.command = new RegExp();

export default handler;

const audioFiles = [
  './mp3/clara.mp3',
  './mp3/clara1.mp3',
  './mp3/clara2.mp3',
  './mp3/clara3.mp3',
  './mp3/clara4.mp3',
];

const acak = [
    'Selamat datang, tuan dan nyonya! Ada yang bisa Binzu bantu?',
    'Hai-hai! Binzu siap melayani Kakak. apa yang harus kulakukan?',
    'Binzu di sini! Apakah ada yang membutuhkan bantuan?',
    'Ohayou gozaimasu! Binzu siap menghadirkan layanan terbaik untuk Kamu.',
    'WADUH MANUSIA TERCAKEP SEDANG MENGGUNAKAN BOT Binzu!? Ada apa kak?',
    'Eh, kakak cakep! Ada yang perlu kita layani?',
    'Hai, bro! Ada apa nih? Kita siap bantu!',
    'Gw di sini, lu mau apa? Kita siap!',
    'Euy, ada yang bisa kita bantu?',
]