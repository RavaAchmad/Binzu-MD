import { parsePhoneNumberFromString } from 'libphonenumber-js';

let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

let handler = async (m, { conn, text, usedPrefix, command: cmd }) => {
  let num = m.quoted?.sender || m.mentionedJid?.[0] || text;
  if (!num) throw `Ex: ${usedPrefix + cmd} @tag / 628xxx`;
  
  // Hanya ambil digit, kemudian tambah suffix jid
  num = num.replace(/\D/g, '') + '@s.whatsapp.net';
  
  if (!(await conn.onWhatsApp(num))[0]?.exists) throw 'User not exists';
  
  let img = await conn.profilePictureUrl(num, 'image').catch(() => './src/avatar_contact.png');
  let bio = await conn.fetchStatus(num).catch(() => {});
  let name = await conn.getName(num);
  let business = await conn.getBusinessProfile(num);
  
  // Parsing nomor menggunakan libphonenumber-js
  let raw = `+${num.split('@')[0]}`;
  const phoneData = parsePhoneNumberFromString(raw);
  let formatted = phoneData && phoneData.isValid() ? phoneData.formatInternational() : raw;
  let country = phoneData && phoneData.country ? regionNames.of(phoneData.country) : '-';
  
  let wea = `\t\t\t\t*▾ WHATSAPP ▾*\n\n*° Country :* ${country.toUpperCase()}\n*° Name :* ${name || '-'}\n*° Format Number :* ${formatted}\n*° Url Api :* wa.me/${num.split('@')[0]}\n*° Mentions :* @${num.split('@')[0]}\n*° Status :* ${bio?.status || '-'}\n*° Date Status :* ${bio?.setAt ? moment(bio.setAt.toDateString()).locale('id').format('LL') : '-'}\n\n${business ? `\t\t\t\t*▾ INFO BUSINESS ▾*\n\n*° BusinessId :* ${business.wid}\n*° Website :* ${business.website || '-'}\n*° Email :* ${business.email || '-'}\n*° Category :* ${business.category}\n*° Address :* ${business.address || '-'}\n*° Timeone :* ${business.business_hours.timezone || '-'}\n*° Descripcion* : ${business.description || '-'}` : '*Standard WhatsApp Account*'}`;
  
  img 
    ? await conn.sendMessage(m.chat, { image: { url: img }, caption: wea, mentions: [num] }, { quoted: m })
    : m.reply(wea);
};

handler.help = ['wastalk'];
handler.tags = ['tools'];
handler.command = /^(wa|whatsapp)stalk$/i;
handler.premium = true;
export default handler;
