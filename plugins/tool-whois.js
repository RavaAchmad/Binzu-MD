import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, args }) => {
    if (!args[0]) {
        throw 'mana link nya';
    }

    // Mengambil argumen dan menghilangkan awalan yang tidak diinginkan
    let domain = args[0].replace(/^(https?:\/\/)?(www\.)?/, '');
    try {
    let api = await fetch(`https://api.botcahx.eu.org/api/webzone/whois?query=${domain}&apikey=ravaja`);
    let json = await api.json()
    console.log(domain)
    await m.reply(json.result)
} catch(e) {
   m.reply(e)
}
}
handler.help = ['whois']
handler.tags = ['tools']
handler.command = /^(whois)$/i  
handler.limit = true;

export default handler;